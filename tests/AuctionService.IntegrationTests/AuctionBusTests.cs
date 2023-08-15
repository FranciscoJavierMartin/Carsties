﻿using System.Net;
using System.Net.Http.Json;
using AuctionService.Data;
using AuctionService.DTOs;
using AuctionService.IntegrationTests.Fixture;
using AuctionService.IntegrationTests.Utils;
using Contracts;
using MassTransit.Testing;
using Microsoft.Extensions.DependencyInjection;

namespace AuctionService.IntegrationTests;

public class AuctionBusTests : IClassFixture<CustomWebAppFactory>, IAsyncLifetime
{
  private readonly CustomWebAppFactory _factory;
  private readonly HttpClient _httpClient;
  private readonly ITestHarness _testHarness;

  public AuctionBusTests(CustomWebAppFactory factory)
  {
    _factory = factory;
    _httpClient = factory.CreateClient();
    _testHarness = factory.Services.GetTestHarness();
  }

  [Fact]
  public async Task CreateAuctionWithValidObject_ShouldPublishAuctionCreated()
  {
    var auction = GetAuctionForCreation();
    _httpClient.SetFakeJwtBearerToken(AuthHelper.GetBearerForUser("bob"));

    var response = await _httpClient.PostAsJsonAsync("api/auctions", auction);

    response.EnsureSuccessStatusCode();
    Assert.True(await _testHarness.Published.Any<AuctionCreated>());
  }

  public Task InitializeAsync() => Task.CompletedTask;

  public Task DisposeAsync()
  {
    using var scope = _factory.Services.CreateScope();
    var db = scope.ServiceProvider.GetRequiredService<AuctionDbContext>();
    DbHelper.ReinitDbForTests(db);

    return Task.CompletedTask;
  }

  private CreateAuctionDto GetAuctionForCreation()
  {
    return new CreateAuctionDto
    {
      Make = "test",
      Model = "testModel",
      ImageUrl = "test",
      Color = "test",
      Mileage = 10,
      Year = 10,
      ReservePrice = 10
    };
  }
}
