import 'package:test/test.dart';
import 'package:trade_pilot_api_client/trade_pilot_api_client.dart';


/// tests for WatchlistApi
void main() {
  final instance = TradePilotApiClient().getWatchlistApi();

  group(WatchlistApi, () {
    // Star an instrument
    //
    //Future<WatchlistItem> addWatchlistItem(AddWatchlistBody addWatchlistBody) async
    test('test addWatchlistItem', () async {
      // TODO
    });

    // Get the current user's instrument watchlist
    //
    //Future<Watchlist> getWatchlist() async
    test('test getWatchlist', () async {
      // TODO
    });

    // Unstar an instrument
    //
    //Future<MessageResponse> removeWatchlistItem(String instrument) async
    test('test removeWatchlistItem', () async {
      // TODO
    });

  });
}
