import 'package:test/test.dart';
import 'package:trade_pilot_api_client/trade_pilot_api_client.dart';

// tests for JournalEntry
void main() {
  final instance = JournalEntryBuilder();
  // TODO add properties to the builder and call build()

  group(JournalEntry, () {
    // int id
    test('to test the property `id`', () async {
      // TODO
    });

    // Optional FK to the originating analysis. Nulled out (but row preserved) if the analysis is later deleted.
    // int analysisId
    test('to test the property `analysisId`', () async {
      // TODO
    });

    // String instrument
    test('to test the property `instrument`', () async {
      // TODO
    });

    // String side
    test('to test the property `side`', () async {
      // TODO
    });

    // String entryPrice
    test('to test the property `entryPrice`', () async {
      // TODO
    });

    // String exitPrice
    test('to test the property `exitPrice`', () async {
      // TODO
    });

    // String quantity
    test('to test the property `quantity`', () async {
      // TODO
    });

    // Auto-computed from (exit - entry) * direction * quantity unless the user overrode it.
    // String pnlAmount
    test('to test the property `pnlAmount`', () async {
      // TODO
    });

    // Auto-computed from (exit - entry) / entry * 100 (signed by side) unless the user overrode it.
    // String pnlPercent
    test('to test the property `pnlPercent`', () async {
      // TODO
    });

    // String outcome
    test('to test the property `outcome`', () async {
      // TODO
    });

    // String mood
    test('to test the property `mood`', () async {
      // TODO
    });

    // String note
    test('to test the property `note`', () async {
      // TODO
    });

    // DateTime tradedAt
    test('to test the property `tradedAt`', () async {
      // TODO
    });

    // DateTime createdAt
    test('to test the property `createdAt`', () async {
      // TODO
    });

    // DateTime updatedAt
    test('to test the property `updatedAt`', () async {
      // TODO
    });

  });
}
