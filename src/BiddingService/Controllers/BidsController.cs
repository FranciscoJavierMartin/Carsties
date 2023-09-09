using BiddingService.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Entities;

namespace BiddingService.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BidsController : ControllerBase
{
  [Authorize]
  [HttpPost]
  public async Task<ActionResult<Bid>> PlaceBid(string auctionId, int amount)
  {
    ActionResult<Bid> result;

    var auction = await DB.Find<Auction>().OneAsync(auctionId);

    if (auction == null)
    {
      // TODO: Check with auction service if that has auction
      result = NotFound();
    }
    else if (auction.Seller == User.Identity.Name)
    {
      result = BadRequest("You cannot bid your own auction");
    }
    else
    {
      var bid = new Bid
      {
        Amount = amount,
        AuctionId = auctionId,
        Bidder = User.Identity.Name
      };

      if (auction.AuctionEnd < DateTime.UtcNow)
      {
        bid.BidStatus = BidStatus.Finished;
      }

      var highBid = await DB.Find<Bid>()
        .Match(a => a.AuctionId == auctionId)
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

      result = Ok(bid);
    }

    return result;
  }
}
