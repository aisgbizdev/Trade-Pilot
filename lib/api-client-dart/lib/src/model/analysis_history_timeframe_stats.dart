//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:trade_pilot_api_client/src/model/analysis_history_outcome_stats.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'analysis_history_timeframe_stats.g.dart';

/// AnalysisHistoryTimeframeStats
///
/// Properties:
/// * [total]
/// * [pending]
/// * [activeValid]
/// * [tp1Hit]
/// * [tp2Hit]
/// * [slHit]
/// * [expired]
/// * [invalidated]
/// * [winRate]
/// * [completionRate]
/// * [timeframe]
@BuiltValue()
abstract class AnalysisHistoryTimeframeStats implements AnalysisHistoryOutcomeStats, Built<AnalysisHistoryTimeframeStats, AnalysisHistoryTimeframeStatsBuilder> {
  @BuiltValueField(wireName: r'timeframe')
  String get timeframe;

  AnalysisHistoryTimeframeStats._();

  factory AnalysisHistoryTimeframeStats([void updates(AnalysisHistoryTimeframeStatsBuilder b)]) = _$AnalysisHistoryTimeframeStats;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(AnalysisHistoryTimeframeStatsBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<AnalysisHistoryTimeframeStats> get serializer => _$AnalysisHistoryTimeframeStatsSerializer();
}

class _$AnalysisHistoryTimeframeStatsSerializer implements PrimitiveSerializer<AnalysisHistoryTimeframeStats> {
  @override
  final Iterable<Type> types = const [AnalysisHistoryTimeframeStats, _$AnalysisHistoryTimeframeStats];

  @override
  final String wireName = r'AnalysisHistoryTimeframeStats';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    AnalysisHistoryTimeframeStats object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'timeframe';
    yield serializers.serialize(
      object.timeframe,
      specifiedType: const FullType(String),
    );
    yield r'total';
    yield serializers.serialize(
      object.total,
      specifiedType: const FullType(int),
    );
    yield r'expired';
    yield serializers.serialize(
      object.expired,
      specifiedType: const FullType(int),
    );
    yield r'pending';
    yield serializers.serialize(
      object.pending,
      specifiedType: const FullType(int),
    );
    yield r'activeValid';
    yield serializers.serialize(
      object.activeValid,
      specifiedType: const FullType(int),
    );
    yield r'tp2Hit';
    yield serializers.serialize(
      object.tp2Hit,
      specifiedType: const FullType(int),
    );
    yield r'winRate';
    yield object.winRate == null ? null : serializers.serialize(
      object.winRate,
      specifiedType: const FullType.nullable(num),
    );
    yield r'completionRate';
    yield object.completionRate == null ? null : serializers.serialize(
      object.completionRate,
      specifiedType: const FullType.nullable(num),
    );
    yield r'slHit';
    yield serializers.serialize(
      object.slHit,
      specifiedType: const FullType(int),
    );
    yield r'invalidated';
    yield serializers.serialize(
      object.invalidated,
      specifiedType: const FullType(int),
    );
    yield r'tp1Hit';
    yield serializers.serialize(
      object.tp1Hit,
      specifiedType: const FullType(int),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    AnalysisHistoryTimeframeStats object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required AnalysisHistoryTimeframeStatsBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'timeframe':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.timeframe = valueDes;
          break;
        case r'total':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(int),
          ) as int;
          result.total = valueDes;
          break;
        case r'expired':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(int),
          ) as int;
          result.expired = valueDes;
          break;
        case r'pending':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(int),
          ) as int;
          result.pending = valueDes;
          break;
        case r'activeValid':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(int),
          ) as int;
          result.activeValid = valueDes;
          break;
        case r'tp2Hit':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(int),
          ) as int;
          result.tp2Hit = valueDes;
          break;
        case r'winRate':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(num),
          ) as num?;
          if (valueDes == null) continue;
          result.winRate = valueDes;
          break;
        case r'completionRate':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(num),
          ) as num?;
          if (valueDes == null) continue;
          result.completionRate = valueDes;
          break;
        case r'slHit':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(int),
          ) as int;
          result.slHit = valueDes;
          break;
        case r'invalidated':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(int),
          ) as int;
          result.invalidated = valueDes;
          break;
        case r'tp1Hit':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(int),
          ) as int;
          result.tp1Hit = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  AnalysisHistoryTimeframeStats deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = AnalysisHistoryTimeframeStatsBuilder();
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

