using AuctionService.Entities;

namespace AuctionService.UnitTests;

public class AuctionEntityTests
{
    [Fact]
    public void HasReservedPrice_ReservePriceGtZero_True()
    {
        Auction auction = new Auction
        {
            ReservePrice = 10
        };

        bool result = auction.HasReservedPrice();

        Assert.True(result);
    }

    [Fact]
    public void HasReservedPrice_ReservePriceIsZero_False()
    {
        Auction auction = new Auction
        {
            ReservePrice = 0
        };

        bool result = auction.HasReservedPrice();

        Assert.False(result);
    }
}