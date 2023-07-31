using AuctionService.Data;
using AuctionService.DTOs;
using AuctionService.Entities;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AuctionService.Controllers;

[ApiController]
[Route("api/auctions")]
public class AuctionsController : ControllerBase
{
  private readonly AuctionDbContext _context;
  private readonly IMapper _mapper;

  public AuctionsController(AuctionDbContext context, IMapper mapper)
  {
    _context = context;
    _mapper = mapper;
  }

  [HttpGet]
  public async Task<ActionResult<List<AuctionDto>>> GetAllAuctions()
  {
    var auctions = await _context.Auctions
      .Include(x => x.Item)
      .OrderBy(x => x.Item.Make)
      .ToListAsync();

    return _mapper.Map<List<AuctionDto>>(auctions);
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
    var auction = _mapper.Map<Auction>(auctionDto);
    auction.Seller = "test";

    _context.Auctions.Add(auction);

    return await _context.SaveChangesAsync() > 0
      ? CreatedAtAction(
          nameof(GetAuctionById),
          new { auction.Id },
          _mapper.Map<AuctionDto>(auction))
      : BadRequest("Could not save changes to the DB");
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
      result = await _context.SaveChangesAsync() > 0
        ? Ok()
        : BadRequest("Could not update DB");
    }

    return result;
  }
}