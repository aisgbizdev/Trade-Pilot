import 'package:test/test.dart';
import 'package:trade_pilot_api_client/trade_pilot_api_client.dart';

// tests for PushPrefs
void main() {
  final instance = PushPrefsBuilder();
  // TODO add properties to the builder and call build()

  group(PushPrefs, () {
    // bool pushExpiry
    test('to test the property `pushExpiry`', () async {
      // TODO
    });

    // bool pushBroadcast
    test('to test the property `pushBroadcast`', () async {
      // TODO
    });

    // bool pushDailySummary
    test('to test the property `pushDailySummary`', () async {
      // TODO
    });

    // bool pushMarketNews
    test('to test the property `pushMarketNews`', () async {
      // TODO
    });

    // bool pushCalendarEvents
    test('to test the property `pushCalendarEvents`', () async {
      // TODO
    });

    // bool pushPriceAnomaly
    test('to test the property `pushPriceAnomaly`', () async {
      // TODO
    });

    // bool pushWeeklyRecap
    test('to test the property `pushWeeklyRecap`', () async {
      // TODO
    });

    // bool pushSignalFlip
    test('to test the property `pushSignalFlip`', () async {
      // TODO
    });

    // FX sessions the user wants a 5-min pre-open ping for. Empty = off.
    // BuiltList<String> marketOpenSessions
    test('to test the property `marketOpenSessions`', () async {
      // TODO
    });

    // Opt-in toggle for the weekly \"we miss you\" nudge after 7+ days idle.
    // bool pushDormancyNudge
    test('to test the property `pushDormancyNudge`', () async {
      // TODO
    });

    // One-shot 24h-after-signup empty-watchlist nudge.
    // bool pushOnboarding
    test('to test the property `pushOnboarding`', () async {
      // TODO
    });

    // When non-null, the UI should render a one-time banner explaining auto-pause.
    // String disengageNoticeCategory
    test('to test the property `disengageNoticeCategory`', () async {
      // TODO
    });

    // Show soft warning when a loss on this instrument fired within the revenge window.
    // bool guardrailRevenge
    test('to test the property `guardrailRevenge`', () async {
      // TODO
    });

    // Show soft warning when the user crosses the per-hour or per-day analysis count.
    // bool guardrailOvertrading
    test('to test the property `guardrailOvertrading`', () async {
      // TODO
    });

    // Show soft warning when a high-impact event for the instrument prints within 30 min.
    // bool guardrailHighRisk
    test('to test the property `guardrailHighRisk`', () async {
      // TODO
    });

    // Opt-in 30-minute countdown after a significant loss before showing the analyse button warning.
    // bool coolingOffEnabled
    test('to test the property `coolingOffEnabled`', () async {
      // TODO
    });

  });
}
