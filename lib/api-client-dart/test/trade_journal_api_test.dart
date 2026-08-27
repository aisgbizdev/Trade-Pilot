import 'package:test/test.dart';
import 'package:trade_pilot_api_client/trade_pilot_api_client.dart';


/// tests for TradeJournalApi
void main() {
  final instance = TradePilotApiClient().getTradeJournalApi();

  group(TradeJournalApi, () {
    // Log a new manual trade-journal entry (optionally linked to an analysis)
    //
    //Future<JournalEntry> createJournalEntry(CreateJournalEntryBody createJournalEntryBody) async
    test('test createJournalEntry', () async {
      // TODO
    });

    // Delete a journal entry
    //
    //Future<MessageResponse> deleteJournalEntry(int id) async
    test('test deleteJournalEntry', () async {
      // TODO
    });

    // Get the journal entry linked to a specific analysis
    //
    // Returns the first journal entry the authenticated user linked to a specific analysis. Returns 404 when no entry is found.
    //
    //Future<JournalEntry> getJournalEntryForAnalysis(int analysisId) async
    test('test getJournalEntryForAnalysis', () async {
      // TODO
    });

    // Anonymised long-vs-short aggregate for an instrument across all users (last 7 days)
    //
    //Future<JournalSentiment> getJournalSentiment(String instrument) async
    test('test getJournalSentiment', () async {
      // TODO
    });

    // Summary stats for the user's trade journal (win rate, avg P/L, best/worst)
    //
    //Future<JournalStats> getJournalStats({ DateTime from, DateTime to }) async
    test('test getJournalStats', () async {
      // TODO
    });

    // List the current user's trade journal entries with optional filters
    //
    //Future<JournalEntryList> listJournalEntries({ String instrument, String outcome, DateTime from, DateTime to, int limit }) async
    test('test listJournalEntries', () async {
      // TODO
    });

    // Update an existing journal entry (e.g. close out an open trade)
    //
    //Future<JournalEntry> updateJournalEntry(int id, UpdateJournalEntryBody updateJournalEntryBody) async
    test('test updateJournalEntry', () async {
      // TODO
    });

  });
}
