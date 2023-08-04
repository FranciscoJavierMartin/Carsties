using AuctionService.Data;
using AuctionService.DTOs;
using AuctionService.Entities;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Contracts;
using MassTransit;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AuctionService.Controllers;

[ApiController]
[Route("api/auctions")]
public class AuctionsController : ControllerBase
{
  private readonly AuctionDbContext _context;
  private readonly IMapper _mapper;
  private readonly IPublishEndpoint _publishEndpoint;

  public AuctionsController(AuctionDbContext context, IMapper mapper, IPublishEndpoint publishEndpoint)
  {
    _context = context;
    _mapper = mapper;
    _publishEndpoint = publishEndpoint;
  }

  [HttpGet]
  public async Task<ActionResult<List<AuctionDto>>> GetAllAuctions(string date)
  {
    var query = _context.Auctions.OrderBy(x => x.Item.Make).AsQueryable();

    if (!string.IsNullOrEmpty(date))
    {
      query = query.Where(x => x.UpdatedAt
        .CompareTo(DateTime.Parse(date).ToUniversalTime()) > 0);
    }

    return await query
      .ProjectTo<AuctionDto>(_mapper.ConfigurationProvider).ToListAsync();
  }

  [HttpGet("{id}")]
  public async Task<ActionResult<AuctionDto>> GetAuctionById(Guid id)
  {
    var auction = await _context.Auctions
      .Include(x => x.Item)
      .FirstOrDefaultAsync(x => x.Id == id);

    return auction == null
      ? NotFound(id)
      : _mapper.Map<AuctionDto>(auction);
  }

  [HttpPost]
  public async Task<ActionResult<AuctionDto>> CreateAuction(CreateAuctionDto auctionDto)
  {
    ActionResult<AuctionDto> result;
    var auction = _mapper.Map<Auction>(auctionDto);
    auction.Seller = "test";

    _context.Auctions.Add(auction);

    AuctionDto newAuction = _mapper.Map<AuctionDto>(auction);
    await _publishEndpoint.Publish(_mapper.Map<AuctionCreated>(newAuction));

    bool isSaved = await _context.SaveChangesAsync() > 0;

    if (isSaved)
    {
      result = CreatedAtAction(nameof(GetAuctionById), new { auction.Id }, newAuction);
    }
    else
    {
      result = BadRequest("Could not save changes to the DB");
    }

    return result;
  }

  [HttpPut("{id}")]
  public async Task<ActionResult> UpdateAuction(Guid id, UpdateAuctionDto updateAuctionDto)
  {
    ActionResult result;

    var auction = await _context.Auctions.Include(x => x.Item)
    .FirstOrDefaultAsync(x => x.Id == id);

    if (auction == null)
    {
      result = NotFound();
    }
    else
    {
      auction.Item.Make = updateAuctionDto.Make ?? auction.Item.Make;
      auction.Item.Model = updateAuctionDto.Model ?? auction.Item.Model;
      auction.Item.Color = updateAuctionDto.Color ?? auction.Item.Color;
      auction.Item.Mileage = updateAuctionDto.Mileage ?? auction.Item.Mileage;
      auction.Item.Year = updateAuctionDto.Year ?? auction.Item.Year;

      await _publishEndpoint.Publish(_mapper.Map<AuctionUpdated>(auction));

      result = await _context.SaveChangesAsync() > 0
        ? Ok()
        : BadRequest("Problem saving changes");
    }

    return result;
  }

  [HttpDelete("{id}")]
  public async Task<ActionResult> DeleteAuction(Guid id)
  {
    ActionResult result;

    var auction = await _context.Auctions.FindAsync(id);

    if (auction == null)
    {
      result = NotFound();
    }
    else
    {
      _context.Auctions.Remove(auction);

      await _publishEndpoint.Publish<AuctionDeleted>(new { id = auction.Id.ToString() });

      result = await _context.SaveChangesAsync() > 0
        ? Ok()
        : BadRequest("Could not update DB");
    }

    return result;
  }
}