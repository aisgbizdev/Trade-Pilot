// Hand-authored — NOT touched by codegen (see .openapi-generator-ignore).
//
// The generated `TradePilotApiClient` (src/api.dart) already exposes a
// configurable base URL and per-tag API getters. This file adds the one
// thing the OpenAPI spec itself can't declare: attaching
// `Authorization: Bearer <token>` the way this backend's `requireAuth`
// middleware actually checks it (a raw header read, not a formal OpenAPI
// securityScheme — so the generator's built-in BearerAuthInterceptor has
// nothing to bind to and does nothing on its own).
//
// This mirrors the pluggable `AuthTokenGetter` in
// lib/api-client-react/src/custom-fetch.ts, the equivalent seam already
// used by the web and Expo/React Native clients. Token storage/refresh
// (including whatever the future account-merging auth flow ends up being)
// is entirely the caller's responsibility — this file only calls whatever
// getter it's given, once per request.

import 'package:dio/dio.dart';
import 'trade_pilot_api_client.dart';

/// Returns a bearer token for the next outgoing request, or null/empty
/// when there's no authenticated session yet.
typedef AuthTokenGetter = Future<String?> Function();

class _AuthTokenInterceptor extends Interceptor {
  _AuthTokenInterceptor(this._getToken);

  final AuthTokenGetter _getToken;

  @override
  void onRequest(RequestOptions options, RequestInterceptorHandler handler) async {
    if (!options.headers.containsKey('Authorization')) {
      final token = await _getToken();
      if (token != null && token.isNotEmpty) {
        options.headers['Authorization'] = 'Bearer $token';
      }
    }
    handler.next(options);
  }
}

/// Configured entry point for the Trade Pilot API from Flutter/Dart.
///
/// ```dart
/// final client = TradePilotClient(
///   baseUrl: 'https://api.tradepilot.app/api',
///   getToken: () async => mySecureStorage.read(key: 'session_token'),
/// );
/// final me = await client.auth.getMe();
/// final created = await client.analyses.createAnalysis(
///   createAnalysisBody: CreateAnalysisBody((b) => b
///     ..instrument = 'XAU/USD'
///     ..timeframe = '1h'
///     ..mode = CreateAnalysisBodyModeEnum.beginner),
/// );
/// ```
class TradePilotClient {
  TradePilotClient({
    required String baseUrl,
    AuthTokenGetter? getToken,
    Dio? dio,
  }) : _client = TradePilotApiClient(dio: dio, basePathOverride: baseUrl) {
    if (getToken != null) {
      _client.dio.interceptors.add(_AuthTokenInterceptor(getToken));
    }
  }

  final TradePilotApiClient _client;

  /// Underlying Dio instance — add your own interceptors (logging, retry,
  /// crash reporting, etc.) or inspect requests directly if needed.
  Dio get dio => _client.dio;

  AuthApi get auth => _client.getAuthApi();
  AnalysesApi get analyses => _client.getAnalysesApi();
  AdminApi get admin => _client.getAdminApi();
  SuperadminApi get superadmin => _client.getSuperadminApi();
  DailySummaryApi get dailySummary => _client.getDailySummaryApi();
  EventsApi get events => _client.getEventsApi();
  FilterPresetsApi get filterPresets => _client.getFilterPresetsApi();
  HealthApi get health => _client.getHealthApi();
  NotificationsApi get notifications => _client.getNotificationsApi();
  PerformanceApi get performance => _client.getPerformanceApi();
  PushApi get push => _client.getPushApi();
  StorageApi get storage => _client.getStorageApi();
  TradeJournalApi get tradeJournal => _client.getTradeJournalApi();
  TraderMirrorApi get traderMirror => _client.getTraderMirrorApi();
  UserPriceAlertsApi get userPriceAlerts => _client.getUserPriceAlertsApi();
  WatchlistApi get watchlist => _client.getWatchlistApi();
}
