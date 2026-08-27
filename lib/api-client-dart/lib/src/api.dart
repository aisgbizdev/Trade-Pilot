//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

import 'package:dio/dio.dart';
import 'package:built_value/serializer.dart';
import 'package:trade_pilot_api_client/src/serializers.dart';
import 'package:trade_pilot_api_client/src/auth/api_key_auth.dart';
import 'package:trade_pilot_api_client/src/auth/basic_auth.dart';
import 'package:trade_pilot_api_client/src/auth/bearer_auth.dart';
import 'package:trade_pilot_api_client/src/auth/oauth.dart';
import 'package:trade_pilot_api_client/src/api/admin_api.dart';
import 'package:trade_pilot_api_client/src/api/analyses_api.dart';
import 'package:trade_pilot_api_client/src/api/auth_api.dart';
import 'package:trade_pilot_api_client/src/api/daily_summary_api.dart';
import 'package:trade_pilot_api_client/src/api/events_api.dart';
import 'package:trade_pilot_api_client/src/api/filter_presets_api.dart';
import 'package:trade_pilot_api_client/src/api/health_api.dart';
import 'package:trade_pilot_api_client/src/api/native_push_api.dart';
import 'package:trade_pilot_api_client/src/api/notifications_api.dart';
import 'package:trade_pilot_api_client/src/api/performance_api.dart';
import 'package:trade_pilot_api_client/src/api/push_api.dart';
import 'package:trade_pilot_api_client/src/api/storage_api.dart';
import 'package:trade_pilot_api_client/src/api/superadmin_api.dart';
import 'package:trade_pilot_api_client/src/api/trade_journal_api.dart';
import 'package:trade_pilot_api_client/src/api/trader_mirror_api.dart';
import 'package:trade_pilot_api_client/src/api/trading_rules_api.dart';
import 'package:trade_pilot_api_client/src/api/user_price_alerts_api.dart';
import 'package:trade_pilot_api_client/src/api/watchlist_api.dart';

class TradePilotApiClient {
  static const String basePath = r'/api';

  final Dio dio;
  final Serializers serializers;

  TradePilotApiClient({
    Dio? dio,
    Serializers? serializers,
    String? basePathOverride,
    List<Interceptor>? interceptors,
  })  : this.serializers = serializers ?? standardSerializers,
        this.dio = dio ??
            Dio(BaseOptions(
              baseUrl: basePathOverride ?? basePath,
              connectTimeout: const Duration(milliseconds: 5000),
              receiveTimeout: const Duration(milliseconds: 3000),
            )) {
    if (interceptors == null) {
      this.dio.interceptors.addAll([
        OAuthInterceptor(),
        BasicAuthInterceptor(),
        BearerAuthInterceptor(),
        ApiKeyAuthInterceptor(),
      ]);
    } else {
      this.dio.interceptors.addAll(interceptors);
    }
  }

  void setOAuthToken(String name, String token) {
    if (this.dio.interceptors.any((i) => i is OAuthInterceptor)) {
      (this.dio.interceptors.firstWhere((i) => i is OAuthInterceptor) as OAuthInterceptor).tokens[name] = token;
    }
  }

  /// Removes the OAuth token associated with the given [name].
  ///
  /// If no [OAuthInterceptor] is registered or no token exists for the given
  /// [name], this method has no effect.
  void removeOAuthToken(String name) {
    if (this.dio.interceptors.any((i) => i is OAuthInterceptor)) {
      (this.dio.interceptors.firstWhere((i) => i is OAuthInterceptor) as OAuthInterceptor).tokens.remove(name);
    }
  }

  void setBearerAuth(String name, String token) {
    if (this.dio.interceptors.any((i) => i is BearerAuthInterceptor)) {
      (this.dio.interceptors.firstWhere((i) => i is BearerAuthInterceptor) as BearerAuthInterceptor).tokens[name] = token;
    }
  }

  /// Removes the bearer authentication token associated with the given [name].
  ///
  /// If no [BearerAuthInterceptor] is registered or no token exists for the
  /// given [name], this method has no effect.
  void removeBearerAuth(String name) {
    if (this.dio.interceptors.any((i) => i is BearerAuthInterceptor)) {
      (this.dio.interceptors.firstWhere((i) => i is BearerAuthInterceptor) as BearerAuthInterceptor).tokens.remove(name);
    }
  }

  void setBasicAuth(String name, String username, String password) {
    if (this.dio.interceptors.any((i) => i is BasicAuthInterceptor)) {
      (this.dio.interceptors.firstWhere((i) => i is BasicAuthInterceptor) as BasicAuthInterceptor).authInfo[name] = BasicAuthInfo(username, password);
    }
  }

  /// Removes the basic authentication credentials associated with the given [name].
  ///
  /// If no [BasicAuthInterceptor] is registered or no credentials exist for the
  /// given [name], this method has no effect.
  void removeBasicAuth(String name) {
    if (this.dio.interceptors.any((i) => i is BasicAuthInterceptor)) {
      (this.dio.interceptors.firstWhere((i) => i is BasicAuthInterceptor) as BasicAuthInterceptor).authInfo.remove(name);
    }
  }

  void setApiKey(String name, String apiKey) {
    if (this.dio.interceptors.any((i) => i is ApiKeyAuthInterceptor)) {
      (this.dio.interceptors.firstWhere((element) => element is ApiKeyAuthInterceptor) as ApiKeyAuthInterceptor).apiKeys[name] = apiKey;
    }
  }

  /// Removes the API key associated with the given [name].
  ///
  /// If no [ApiKeyAuthInterceptor] is registered or no API key exists for the
  /// given [name], this method has no effect.
  void removeApiKey(String name) {
    if (this.dio.interceptors.any((i) => i is ApiKeyAuthInterceptor)) {
      (this.dio.interceptors.firstWhere((element) => element is ApiKeyAuthInterceptor) as ApiKeyAuthInterceptor).apiKeys.remove(name);
    }
  }

  /// Get AdminApi instance, base route and serializer can be overridden by a given but be careful,
  /// by doing that all interceptors will not be executed
  AdminApi getAdminApi() {
    return AdminApi(dio, serializers);
  }

  /// Get AnalysesApi instance, base route and serializer can be overridden by a given but be careful,
  /// by doing that all interceptors will not be executed
  AnalysesApi getAnalysesApi() {
    return AnalysesApi(dio, serializers);
  }

  /// Get AuthApi instance, base route and serializer can be overridden by a given but be careful,
  /// by doing that all interceptors will not be executed
  AuthApi getAuthApi() {
    return AuthApi(dio, serializers);
  }

  /// Get DailySummaryApi instance, base route and serializer can be overridden by a given but be careful,
  /// by doing that all interceptors will not be executed
  DailySummaryApi getDailySummaryApi() {
    return DailySummaryApi(dio, serializers);
  }

  /// Get EventsApi instance, base route and serializer can be overridden by a given but be careful,
  /// by doing that all interceptors will not be executed
  EventsApi getEventsApi() {
    return EventsApi(dio, serializers);
  }

  /// Get FilterPresetsApi instance, base route and serializer can be overridden by a given but be careful,
  /// by doing that all interceptors will not be executed
  FilterPresetsApi getFilterPresetsApi() {
    return FilterPresetsApi(dio, serializers);
  }

  /// Get HealthApi instance, base route and serializer can be overridden by a given but be careful,
  /// by doing that all interceptors will not be executed
  HealthApi getHealthApi() {
    return HealthApi(dio, serializers);
  }

  /// Get NativePushApi instance, base route and serializer can be overridden by a given but be careful,
  /// by doing that all interceptors will not be executed
  NativePushApi getNativePushApi() {
    return NativePushApi(dio, serializers);
  }

  /// Get NotificationsApi instance, base route and serializer can be overridden by a given but be careful,
  /// by doing that all interceptors will not be executed
  NotificationsApi getNotificationsApi() {
    return NotificationsApi(dio, serializers);
  }

  /// Get PerformanceApi instance, base route and serializer can be overridden by a given but be careful,
  /// by doing that all interceptors will not be executed
  PerformanceApi getPerformanceApi() {
    return PerformanceApi(dio, serializers);
  }

  /// Get PushApi instance, base route and serializer can be overridden by a given but be careful,
  /// by doing that all interceptors will not be executed
  PushApi getPushApi() {
    return PushApi(dio, serializers);
  }

  /// Get StorageApi instance, base route and serializer can be overridden by a given but be careful,
  /// by doing that all interceptors will not be executed
  StorageApi getStorageApi() {
    return StorageApi(dio, serializers);
  }

  /// Get SuperadminApi instance, base route and serializer can be overridden by a given but be careful,
  /// by doing that all interceptors will not be executed
  SuperadminApi getSuperadminApi() {
    return SuperadminApi(dio, serializers);
  }

  /// Get TradeJournalApi instance, base route and serializer can be overridden by a given but be careful,
  /// by doing that all interceptors will not be executed
  TradeJournalApi getTradeJournalApi() {
    return TradeJournalApi(dio, serializers);
  }

  /// Get TraderMirrorApi instance, base route and serializer can be overridden by a given but be careful,
  /// by doing that all interceptors will not be executed
  TraderMirrorApi getTraderMirrorApi() {
    return TraderMirrorApi(dio, serializers);
  }

  /// Get TradingRulesApi instance, base route and serializer can be overridden by a given but be careful,
  /// by doing that all interceptors will not be executed
  TradingRulesApi getTradingRulesApi() {
    return TradingRulesApi(dio, serializers);
  }

  /// Get UserPriceAlertsApi instance, base route and serializer can be overridden by a given but be careful,
  /// by doing that all interceptors will not be executed
  UserPriceAlertsApi getUserPriceAlertsApi() {
    return UserPriceAlertsApi(dio, serializers);
  }

  /// Get WatchlistApi instance, base route and serializer can be overridden by a given but be careful,
  /// by doing that all interceptors will not be executed
  WatchlistApi getWatchlistApi() {
    return WatchlistApi(dio, serializers);
  }
}
