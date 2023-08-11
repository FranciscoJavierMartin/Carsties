using AuctionService.Data;
using AuctionService.DTOs;
using AuctionService.Entities;
using AutoMapper;
using Contracts;
using MassTransit;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AuctionService.Controllers;

[ApiController]
[Route("api/auctions")]
public class AuctionsController : ControllerBase
{
  private readonly IAuctionRepository _auctionRepository;
  private readonly IMapper _mapper;
  private readonly IPublishEndpoint _publishEndpoint;

  public AuctionsController(IAuctionRepository auctionRepository, IMapper mapper, IPublishEndpoint publishEndpoint)
  {
    _auctionRepository = auctionRepository;
    _mapper = mapper;
    _publishEndpoint = publishEndpoint;
  }

  [HttpGet]
  public async Task<ActionResult<List<AuctionDto>>> GetAllAuctions(string date)
  {
    return await _auctionRepository.GetAuctionsAsync(date);
  }

  [HttpGet("{id}")]
  public async Task<ActionResult<AuctionDto>> GetAuctionById(Guid id)
  {
    AuctionDto auction = await _auctionRepository.GetAuctionByIdAsync(id);

    return auction == null
      ? NotFound()
      : auction;
  }

  [Authorize]
  [HttpPost]
  public async Task<ActionResult<AuctionDto>> CreateAuction(CreateAuctionDto auctionDto)
  {
    ActionResult<AuctionDto> result;
    var auction = _mapper.Map<Auction>(auctionDto);
    auction.Seller = User.Identity.Name;

    _auctionRepository.AddAuction(auction);

    AuctionDto newAuction = _mapper.Map<AuctionDto>(auction);
    await _publishEndpoint.Publish(_mapper.Map<AuctionCreated>(newAuction));

    if (await _auctionRepository.SaveChangesAsync())
    {
      result = CreatedAtAction(nameof(GetAuctionById), new { auction.Id }, newAuction);
    }
    else
    {
      result = BadRequest("Could not save changes to the DB");
    }

    return result;
  }

  [Authorize]
  [HttpPut("{id}")]
  public async Task<ActionResult> UpdateAuction(Guid id, UpdateAuctionDto updateAuctionDto)
  {
    ActionResult result;

    var auction = await _auctionRepository.GetAuctionEntityById(id);

    if (auction == null)
    {
      result = NotFound();
    }
    else if (auction.Seller != User.Identity.Name)
    {
      result = Forbid();
    }
    else
    {
      auction.Item.Make = updateAuctionDto.Make ?? auction.Item.Make;
      auction.Item.Model = updateAuctionDto.Model ?? auction.Item.Model;
      auction.Item.Color = updateAuctionDto.Color ?? auction.Item.Color;
      auction.Item.Mileage = updateAuctionDto.Mileage ?? auction.Item.Mileage;
      auction.Item.Year = updateAuctionDto.Year ?? auction.Item.Year;

      await _publishEndpoint.Publish(_mapper.Map<AuctionUpdated>(auction));

      result = await _auctionRepository.SaveChangesAsync()
        ? Ok()
        : BadRequest("Problem saving changes");
    }

    return result;
  }

  [Authorize]
  [HttpDelete("{id}")]
  public async Task<ActionResult> DeleteAuction(Guid id)
  {
    ActionResult result;

    var auction = await _auctionRepository.GetAuctionEntityById(id);

    if (auction == null)
    {
      result = NotFound();
    }
    else if (auction.Seller != User.Identity.Name)
    {
      result = Forbid();
    }
    else
    {
      _auctionRepository.RemoveAuction(auction);

      await _publishEndpoint.Publish<AuctionDeleted>(new { id = auction.Id.ToString() });

      result = await _auctionRepository.SaveChangesAsync()
        ? Ok()
        : BadRequest("Could not update DB");
    }

    return result;
  }
}