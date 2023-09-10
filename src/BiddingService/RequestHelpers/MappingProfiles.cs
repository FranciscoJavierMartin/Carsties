using AutoMapper;
using BiddingService.DTOs;
using BiddingService.Models;
using Contracts;

namespace BiddingService.RequestHelers;

public class MappingProfiles : Profile
{
  public MappingProfiles()
  {
    CreateMap<Bid, BidDto>();
    CreateMap<Bid, BidPlaced>();
  }
}
