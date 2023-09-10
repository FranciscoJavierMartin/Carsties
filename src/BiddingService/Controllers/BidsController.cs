using AutoMapper;
using BiddingService.DTOs;
using BiddingService.Models;
using BiddingService.Services;
using Contracts;
using MassTransit;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Entities;

namespace BiddingService.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BidsController : ControllerBase
{
  private readonly IMapper _mapper;
  private readonly IPublishEndpoint _publishEndpoint;
  private readonly GrpcAuctionClient _grpcClient;

  public BidsController(IMapper mapper, IPublishEndpoint publishEndpoint,
    GrpcAuctionClient grpcClient)
  {
    _mapper = mapper;
    _publishEndpoint = publishEndpoint;
    _grpcClient = grpcClient;
  }

  [Authorize]
  [HttpPost]
  public async Task<ActionResult<BidDto>> PlaceBid(string auctionId, int amount)
  {
    ActionResult<BidDto> result;

    var auction = await DB.Find<Auction>().OneAsync(auctionId);

    if (auction == null)
    {
      auction = _grpcClient.GetAuction(auctionId);

      if (auction == null)
      {
        result = BadRequest("Cannot accept bids on this auction at this time");
      }
      else
      {
        result = await ProcessPlaceBid(auction, amount);
      }
    }
    else if (auction.Seller == User.Identity.Name)
    {
      result = BadRequest("You cannot bid your own auction");
    }
    else
    {
      result = await ProcessPlaceBid(auction, amount);
    }

    return result;
  }

  [HttpGet("{auctionId}")]
  public async Task<ActionResult<List<BidDto>>> GetBidsForAcution(string auctionId)
  {
    var bids = await DB
      .Find<Bid>()
      .Match(a => a.AuctionId == auctionId)
      .Sort(b => b.Descending(a => a.BidTime))
      .ExecuteAsync();

    return bids.Select(_mapper.Map<BidDto>).ToList();
  }

  private async Task<ActionResult<BidDto>> ProcessPlaceBid(Auction auction, int amount)
  {
    var bid = new Bid
    {
      Amount = amount,
      AuctionId = auction.ID,
      Bidder = User.Identity.Name
    };

    if (auction.AuctionEnd < DateTime.UtcNow)
    {
      bid.BidStatus = BidStatus.Finished;
    }

    var highBid = await DB.Find<Bid>()
      .Match(a => a.AuctionId == auction.ID)
      .Sort(b => b.Descending(x => x.Amount))
      .ExecuteFirstAsync();

    if (highBid != null && amount > highBid.Amount || highBid == null)
    {
      bid.BidStatus = amount > auction.ReservePrice
        ? BidStatus.Accepted
        : BidStatus.AcceptedBelowReserve;
    }

    if (highBid != null && bid.Amount <= highBid.Amount)
    {
      bid.BidStatus = BidStatus.TooLow;
    }

    await DB.SaveAsync(bid);

    await _publishEndpoint.Publish(_mapper.Map<BidPlaced>(bid));

    return Ok(_mapper.Map<BidDto>(bid));
  }
}
