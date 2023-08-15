using System.Net;
using System.Net.Http.Json;
using AuctionService.Data;
using AuctionService.DTOs;
using AuctionService.IntegrationTests.Fixtures;
using AuctionService.IntegrationTests.Utils;
using Microsoft.Extensions.DependencyInjection;

namespace AuctionService.IntegrationTests;

[Collection("Shared collection")]
public class AuctionControllerTests : IAsyncLifetime
{
  private readonly CustomWebAppFactory _factory;
  private readonly HttpClient _httpClient;
  private const string _gT_ID = "afbee524-5972-4075-8800-7d1f9d7b0a0c";

  public AuctionControllerTests(CustomWebAppFactory factory)
  {
    _factory = factory;
    _httpClient = factory.CreateClient();
  }

  [Fact]
  public async Task GetAuctions_ShouldReturn3Auctions()
  {
    var response = await _httpClient.GetFromJsonAsync<List<AuctionDto>>("api/auctions");
    Assert.Equal(3, response.Count);
  }

  [Fact]
  public async Task GetAuctionById_WithValidId_ShouldReturnAuction()
  {
    var response = await _httpClient.GetFromJsonAsync<AuctionDto>($"api/auctions/{_gT_ID}");
    Assert.Equal(new Guid(_gT_ID), response.Id);
  }

  [Fact]
  public async Task GetAuctionById_WithInvalidId_ShouldReturn404Response()
  {
    var response = await _httpClient.GetAsync($"api/auctions/{Guid.NewGuid()}");
    Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
  }

  [Fact]
  public async Task CreateAuction_WithNoAuth_ShouldReturn401Response()
  {
    var auction = new CreateAuctionDto { Make = "test" };
    var response = await _httpClient.PostAsJsonAsync($"api/auctions", auction);
    Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
  }

  [Fact]
  public async Task CreateAuction_WithAuth_ShouldReturn201Response()
  {
    var auction = GetAuctionForCreation();
    _httpClient.SetFakeJwtBearerToken(AuthHelper.GetBearerForUser("bob"));

    var response = await _httpClient.PostAsJsonAsync($"api/auctions", auction);

    response.EnsureSuccessStatusCode();
    Assert.Equal(HttpStatusCode.Created, response.StatusCode);
    var createdAuction = await response.Content.ReadFromJsonAsync<AuctionDto>();
    Assert.Equal("bob", createdAuction.Seller);
  }

  [Fact]
  public async Task CreateAuction_WithInvalidCreateAuctionDto_ShouldReturn400Response()
  {
    var auction = GetAuctionForCreation();
    auction.Make = null;
    _httpClient.SetFakeJwtBearerToken(AuthHelper.GetBearerForUser("bob"));

    var response = await _httpClient.PostAsJsonAsync("api/auctions", auction);

    Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
  }

  [Fact]
  public async Task UpdateAuction_WithValidUpdateDtoAndUser_ShouldReturn200Response()
  {
    var updateAuction = new UpdateAuctionDto { Make = "Updated" };
    _httpClient.SetFakeJwtBearerToken(AuthHelper.GetBearerForUser("bob"));

    var response = await _httpClient.PutAsJsonAsync($"api/auctions/{_gT_ID}", updateAuction);

    Assert.Equal(HttpStatusCode.OK, response.StatusCode);
  }

  [Fact]
  public async Task UpdateAuction_WithValidUpdateDtoAndInvalidUser_ShouldReturn403Response()
  {
    var updateAuction = new UpdateAuctionDto { Make = "Updated" };
    _httpClient.SetFakeJwtBearerToken(AuthHelper.GetBearerForUser("notbob"));

    var response = await _httpClient.PutAsJsonAsync($"api/auctions/{_gT_ID}", updateAuction);

    Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
  }

  public Task InitializeAsync() => Task.CompletedTask;

  public Task DisposeAsync()
  {
    using var scope = _factory.Services.CreateScope();
    var db = scope.ServiceProvider.GetRequiredService<AuctionDbContext>();
    DbHelper.ReinitDbForTests(db);

    return Task.CompletedTask;
  }

  private static CreateAuctionDto GetAuctionForCreation()
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
