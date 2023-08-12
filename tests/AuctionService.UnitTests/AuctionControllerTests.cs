﻿using AuctionService.Controllers;
using AuctionService.Data;
using AuctionService.DTOs;
using AuctionService.Entities;
using AuctionService.RequestHelpers;
using AuctionService.UnitTests.Utils;
using AutoFixture;
using AutoMapper;
using MassTransit;
using Microsoft.AspNetCore.Http;
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
    )
    {
      ControllerContext = new ControllerContext
      {
        HttpContext = new DefaultHttpContext
        {
          User = Helpers.GetClaimsPrincipal()
        }
      }
    };
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

  [Fact]
  public async Task CreateAuction_WithValidCreateAuctionDto_ReturnsCreatedAtAction()
  {
    var auction = _fixture.Create<CreateAuctionDto>();
    _auctionRepositoryMock
      .Setup(repo => repo.AddAuction(It.IsAny<Auction>()));
    _auctionRepositoryMock.Setup(repo => repo.SaveChangesAsync()).ReturnsAsync(true);

    var result = await _controller.CreateAuction(auction);
    var createdResult = result.Result as CreatedAtActionResult;

    Assert.NotNull(createdResult);
    Assert.Equal("GetAuctionById", createdResult.ActionName);
    Assert.IsType<AuctionDto>(createdResult.Value);
  }

  [Fact]
  public async Task CreateAuction_FailedSave_Returns400BadRequest()
  {
    var auction = _fixture.Create<CreateAuctionDto>();
    _auctionRepositoryMock
      .Setup(repo => repo.AddAuction(It.IsAny<Auction>()));
    _auctionRepositoryMock.Setup(repo => repo.SaveChangesAsync()).ReturnsAsync(false);

    var result = await _controller.CreateAuction(auction);

    Assert.IsType<BadRequestObjectResult>(result.Result);
  }

  // [Fact]
  // public async Task UpdateAuction_WithUpdateAuctionDto_ReturnsOkResponse()
  // {
  //   var auction = _fixture.Build<Auction>().Without(x => x.Item).Create();
  //   auction.Item = _fixture.Build<Item>().Without(x => x.Auction).Create();
  //   auction.Seller = "test";
  //   var updateDto = _fixture.Create<UpdateAuctionDto>();
  //   _auctionRepositoryMock.Setup(repo => repo.GetAuctionEntityById(It.IsAny<Guid>()))
  //       .ReturnsAsync(auction);
  //   _auctionRepositoryMock.Setup(repo => repo.SaveChangesAsync()).ReturnsAsync(true);

  //   var result = await _controller.UpdateAuction(auction.Id, updateDto);

  //   Assert.IsType<OkResult>(result);
  // }

  [Fact]
  public async Task UpdateAuction_WithInvalidUser_Returns403Forbid()
  {
    var auction = _fixture.Build<Auction>().Without(x => x.Item).Create();
    auction.Item = _fixture.Build<Item>().Without(x => x.Auction).Create();
    auction.Seller = "not-test";
    var updateDto = _fixture.Create<UpdateAuctionDto>();
    _auctionRepositoryMock.Setup(repo => repo.GetAuctionEntityById(It.IsAny<Guid>()))
        .ReturnsAsync(auction);

    var result = await _controller.UpdateAuction(auction.Id, updateDto);

    Assert.IsType<ForbidResult>(result);
  }

  [Fact]
  public async Task UpdateAuction_WithInvalidGuid_ReturnsNotFound()
  {
    var auction = _fixture.Build<Auction>().Without(x => x.Item).Create();
    var updateDto = _fixture.Create<UpdateAuctionDto>();

    _auctionRepositoryMock.Setup(repo => repo.GetAuctionEntityById(It.IsAny<Guid>()))
        .ReturnsAsync(value: null);

    var result = await _controller.UpdateAuction(auction.Id, updateDto);

    Assert.IsType<NotFoundResult>(result);
  }

  // [Fact]
  // public async Task DeleteAuction_WithValidUser_ReturnsOkResponse()
  // {
  //   var auction = _fixture.Build<Auction>().Without(x => x.Item).Create();
  //   auction.Seller = "test";

  //   _auctionRepositoryMock.Setup(repo => repo.GetAuctionEntityById(It.IsAny<Guid>()))
  //       .ReturnsAsync(auction);
  //   _auctionRepositoryMock.Setup(repo => repo.SaveChangesAsync()).ReturnsAsync(true);

  //   var result = await _controller.DeleteAuction(auction.Id);

  //   Assert.IsType<OkResult>(result);
  // }

  [Fact]
  public async Task DeleteAuction_WithInvalidGuid_Returns404Response()
  {
    var auction = _fixture.Build<Auction>().Without(x => x.Item).Create();

    _auctionRepositoryMock.Setup(repo => repo.GetAuctionEntityById(It.IsAny<Guid>()))
        .ReturnsAsync(value: null);

    var result = await _controller.DeleteAuction(auction.Id);

    Assert.IsType<NotFoundResult>(result);
  }
}
