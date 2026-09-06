//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:trade_pilot_api_client/src/model/analytics_usage_stats_daily_activity_inner.dart';
import 'package:trade_pilot_api_client/src/model/analytics_usage_stats_device_breakdown_inner.dart';
import 'package:built_collection/built_collection.dart';
import 'package:trade_pilot_api_client/src/model/analytics_usage_stats_country_breakdown_inner.dart';
import 'package:trade_pilot_api_client/src/model/analytics_usage_stats_feature_breakdown_inner.dart';
import 'package:trade_pilot_api_client/src/model/analytics_usage_stats_browser_breakdown_inner.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'analytics_usage_stats.g.dart';

/// AnalyticsUsageStats
///
/// Properties:
/// * [windowDays] 
/// * [dailyActivity] 
/// * [featureBreakdown] 
/// * [deviceBreakdown] 
/// * [browserBreakdown] 
/// * [countryBreakdown] 
@BuiltValue()
abstract class AnalyticsUsageStats implements Built<AnalyticsUsageStats, AnalyticsUsageStatsBuilder> {
  @BuiltValueField(wireName: r'windowDays')
  int get windowDays;

  @BuiltValueField(wireName: r'dailyActivity')
  BuiltList<AnalyticsUsageStatsDailyActivityInner> get dailyActivity;

  @BuiltValueField(wireName: r'featureBreakdown')
  BuiltList<AnalyticsUsageStatsFeatureBreakdownInner> get featureBreakdown;

  @BuiltValueField(wireName: r'deviceBreakdown')
  BuiltList<AnalyticsUsageStatsDeviceBreakdownInner> get deviceBreakdown;

  @BuiltValueField(wireName: r'browserBreakdown')
  BuiltList<AnalyticsUsageStatsBrowserBreakdownInner> get browserBreakdown;

  @BuiltValueField(wireName: r'countryBreakdown')
  BuiltList<AnalyticsUsageStatsCountryBreakdownInner> get countryBreakdown;

  AnalyticsUsageStats._();

  factory AnalyticsUsageStats([void updates(AnalyticsUsageStatsBuilder b)]) = _$AnalyticsUsageStats;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(AnalyticsUsageStatsBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<AnalyticsUsageStats> get serializer => _$AnalyticsUsageStatsSerializer();
}

class _$AnalyticsUsageStatsSerializer implements PrimitiveSerializer<AnalyticsUsageStats> {
  @override
  final Iterable<Type> types = const [AnalyticsUsageStats, _$AnalyticsUsageStats];

  @override
  final String wireName = r'AnalyticsUsageStats';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    AnalyticsUsageStats object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'windowDays';
    yield serializers.serialize(
      object.windowDays,
      specifiedType: const FullType(int),
    );
    yield r'dailyActivity';
    yield serializers.serialize(
      object.dailyActivity,
      specifiedType: const FullType(BuiltList, [FullType(AnalyticsUsageStatsDailyActivityInner)]),
    );
    yield r'featureBreakdown';
    yield serializers.serialize(
      object.featureBreakdown,
      specifiedType: const FullType(BuiltList, [FullType(AnalyticsUsageStatsFeatureBreakdownInner)]),
    );
    yield r'deviceBreakdown';
    yield serializers.serialize(
      object.deviceBreakdown,
      specifiedType: const FullType(BuiltList, [FullType(AnalyticsUsageStatsDeviceBreakdownInner)]),
    );
    yield r'browserBreakdown';
    yield serializers.serialize(
      object.browserBreakdown,
      specifiedType: const FullType(BuiltList, [FullType(AnalyticsUsageStatsBrowserBreakdownInner)]),
    );
    yield r'countryBreakdown';
    yield serializers.serialize(
      object.countryBreakdown,
      specifiedType: const FullType(BuiltList, [FullType(AnalyticsUsageStatsCountryBreakdownInner)]),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    AnalyticsUsageStats object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required AnalyticsUsageStatsBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'windowDays':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(int),
          ) as int;
          result.windowDays = valueDes;
          break;
        case r'dailyActivity':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(BuiltList, [FullType(AnalyticsUsageStatsDailyActivityInner)]),
          ) as BuiltList<AnalyticsUsageStatsDailyActivityInner>;
          result.dailyActivity.replace(valueDes);
          break;
        case r'featureBreakdown':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(BuiltList, [FullType(AnalyticsUsageStatsFeatureBreakdownInner)]),
          ) as BuiltList<AnalyticsUsageStatsFeatureBreakdownInner>;
          result.featureBreakdown.replace(valueDes);
          break;
        case r'deviceBreakdown':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(BuiltList, [FullType(AnalyticsUsageStatsDeviceBreakdownInner)]),
          ) as BuiltList<AnalyticsUsageStatsDeviceBreakdownInner>;
          result.deviceBreakdown.replace(valueDes);
          break;
        case r'browserBreakdown':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(BuiltList, [FullType(AnalyticsUsageStatsBrowserBreakdownInner)]),
          ) as BuiltList<AnalyticsUsageStatsBrowserBreakdownInner>;
          result.browserBreakdown.replace(valueDes);
          break;
        case r'countryBreakdown':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(BuiltList, [FullType(AnalyticsUsageStatsCountryBreakdownInner)]),
          ) as BuiltList<AnalyticsUsageStatsCountryBreakdownInner>;
          result.countryBreakdown.replace(valueDes);
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  AnalyticsUsageStats deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = AnalyticsUsageStatsBuilder();
    final serializedList = (serialized as Iterable<Object?>).toList();
    final unhandled = <Object?>[];
    _deserializeProperties(
      serializers,
      serialized,
      specifiedType: specifiedType,
      serializedList: serializedList,
      unhandled: unhandled,
      result: result,
    );
    return result.build();
  }
}

