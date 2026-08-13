//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:trade_pilot_api_client/src/model/analytics_token_stats_top_users_inner.dart';
import 'package:trade_pilot_api_client/src/model/analytics_token_stats_totals.dart';
import 'package:built_collection/built_collection.dart';
import 'package:trade_pilot_api_client/src/model/analytics_token_stats_daily_tokens_inner.dart';
import 'package:trade_pilot_api_client/src/model/analytics_token_stats_by_instrument_inner.dart';
import 'package:trade_pilot_api_client/src/model/analytics_token_stats_by_model_inner.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'analytics_token_stats.g.dart';

/// AnalyticsTokenStats
///
/// Properties:
/// * [windowDays] 
/// * [dailyTokens] 
/// * [byModel] 
/// * [byInstrument] 
/// * [topUsers] 
/// * [totals] 
@BuiltValue()
abstract class AnalyticsTokenStats implements Built<AnalyticsTokenStats, AnalyticsTokenStatsBuilder> {
  @BuiltValueField(wireName: r'windowDays')
  int get windowDays;

  @BuiltValueField(wireName: r'dailyTokens')
  BuiltList<AnalyticsTokenStatsDailyTokensInner> get dailyTokens;

  @BuiltValueField(wireName: r'byModel')
  BuiltList<AnalyticsTokenStatsByModelInner> get byModel;

  @BuiltValueField(wireName: r'byInstrument')
  BuiltList<AnalyticsTokenStatsByInstrumentInner> get byInstrument;

  @BuiltValueField(wireName: r'topUsers')
  BuiltList<AnalyticsTokenStatsTopUsersInner> get topUsers;

  @BuiltValueField(wireName: r'totals')
  AnalyticsTokenStatsTotals get totals;

  AnalyticsTokenStats._();

  factory AnalyticsTokenStats([void updates(AnalyticsTokenStatsBuilder b)]) = _$AnalyticsTokenStats;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(AnalyticsTokenStatsBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<AnalyticsTokenStats> get serializer => _$AnalyticsTokenStatsSerializer();
}

class _$AnalyticsTokenStatsSerializer implements PrimitiveSerializer<AnalyticsTokenStats> {
  @override
  final Iterable<Type> types = const [AnalyticsTokenStats, _$AnalyticsTokenStats];

  @override
  final String wireName = r'AnalyticsTokenStats';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    AnalyticsTokenStats object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'windowDays';
    yield serializers.serialize(
      object.windowDays,
      specifiedType: const FullType(int),
    );
    yield r'dailyTokens';
    yield serializers.serialize(
      object.dailyTokens,
      specifiedType: const FullType(BuiltList, [FullType(AnalyticsTokenStatsDailyTokensInner)]),
    );
    yield r'byModel';
    yield serializers.serialize(
      object.byModel,
      specifiedType: const FullType(BuiltList, [FullType(AnalyticsTokenStatsByModelInner)]),
    );
    yield r'byInstrument';
    yield serializers.serialize(
      object.byInstrument,
      specifiedType: const FullType(BuiltList, [FullType(AnalyticsTokenStatsByInstrumentInner)]),
    );
    yield r'topUsers';
    yield serializers.serialize(
      object.topUsers,
      specifiedType: const FullType(BuiltList, [FullType(AnalyticsTokenStatsTopUsersInner)]),
    );
    yield r'totals';
    yield serializers.serialize(
      object.totals,
      specifiedType: const FullType(AnalyticsTokenStatsTotals),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    AnalyticsTokenStats object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required AnalyticsTokenStatsBuilder result,
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
        case r'dailyTokens':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(BuiltList, [FullType(AnalyticsTokenStatsDailyTokensInner)]),
          ) as BuiltList<AnalyticsTokenStatsDailyTokensInner>;
          result.dailyTokens.replace(valueDes);
          break;
        case r'byModel':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(BuiltList, [FullType(AnalyticsTokenStatsByModelInner)]),
          ) as BuiltList<AnalyticsTokenStatsByModelInner>;
          result.byModel.replace(valueDes);
          break;
        case r'byInstrument':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(BuiltList, [FullType(AnalyticsTokenStatsByInstrumentInner)]),
          ) as BuiltList<AnalyticsTokenStatsByInstrumentInner>;
          result.byInstrument.replace(valueDes);
          break;
        case r'topUsers':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(BuiltList, [FullType(AnalyticsTokenStatsTopUsersInner)]),
          ) as BuiltList<AnalyticsTokenStatsTopUsersInner>;
          result.topUsers.replace(valueDes);
          break;
        case r'totals':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(AnalyticsTokenStatsTotals),
          ) as AnalyticsTokenStatsTotals;
          result.totals.replace(valueDes);
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  AnalyticsTokenStats deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = AnalyticsTokenStatsBuilder();
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

