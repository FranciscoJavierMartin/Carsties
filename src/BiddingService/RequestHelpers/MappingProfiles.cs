using AutoMapper;
using BiddingService.DTOs;
using BiddingService.Models;

namespace BiddingService.RequestHelers;

public class MappingProfiles : Profile
{
  public MappingProfiles()
  {
    CreateMap<Bid, BidDto>();
  }
}
