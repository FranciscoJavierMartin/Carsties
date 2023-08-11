﻿using AuctionService.Controllers;
using AuctionService.Data;
using AuctionService.DTOs;
using AuctionService.RequestHelpers;
using AutoFixture;
using AutoMapper;
using MassTransit;
using Microsoft.AspNetCore.Mvc;
using Moq;

namespace AuctionService.UnitTests;

public class AuctionControllerTests
{
  private readonly Mock<IAuctionRepository> _auctionRepositoryMock;
  private readonly Mock<IPublishEndpoint> _publishEndpointMock;
  private readonly Fixture _fixture;
  private readonly AuctionsController _controller;
  private readonly IMapper _mapper;

  public AuctionControllerTests()
  {
    _fixture = new Fixture();
    _auctionRepositoryMock = new Mock<IAuctionRepository>();
    _publishEndpointMock = new Mock<IPublishEndpoint>();

    var mockMapper = new MapperConfiguration(mc =>
    {
      mc.AddMaps(typeof(MappingProfiles).Assembly);
    }).CreateMapper().ConfigurationProvider;

    _mapper = new Mapper(mockMapper);
    _controller = new AuctionsController(
      _auctionRepositoryMock.Object,
      _mapper,
      _publishEndpointMock.Object
    );
  }

  [Fact]
  public async Task GetAuctions_WithNoParams_Returns10Auctions()
  {
    List<AuctionDto> auctions = _fixture.CreateMany<AuctionDto>(10).ToList();
    _auctionRepositoryMock.Setup(repo => repo.GetAuctionsAsync(null)).ReturnsAsync(auctions);

    var result = await _controller.GetAllAuctions(null);

    Assert.Equal(10, result.Value.Count);
    Assert.IsType<ActionResult<List<AuctionDto>>>(result);
  }

  [Fact]
  public async Task GetAuctionById_WithValidGuid_ReturnsAuction()
  {
    AuctionDto auction = _fixture.Create<AuctionDto>();
    _auctionRepositoryMock
      .Setup(repo => repo.GetAuctionByIdAsync(It.IsAny<Guid>()))
      .ReturnsAsync(auction);

    var result = await _controller.GetAuctionById(auction.Id);

    Assert.Equal(auction.Make, result.Value.Make);
    Assert.IsType<ActionResult<AuctionDto>>(result);
  }

  [Fact]
  public async Task GetAuctionById_WithInvalidGuid_ReturnsNotFound()
  {

    _auctionRepositoryMock
      .Setup(repo => repo.GetAuctionByIdAsync(It.IsAny<Guid>()))
      .ReturnsAsync(value: null);

    var result = await _controller.GetAuctionById(Guid.NewGuid());

    Assert.IsType<NotFoundResult>(result.Result);
  }
}
