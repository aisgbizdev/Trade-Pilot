//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'analysis_history_outcome_stats.g.dart';

/// AnalysisHistoryOutcomeStats
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
@BuiltValue(instantiable: false)
abstract class AnalysisHistoryOutcomeStats  {
  @BuiltValueField(wireName: r'total')
  int get total;

  @BuiltValueField(wireName: r'pending')
  int get pending;

  @BuiltValueField(wireName: r'activeValid')
  int get activeValid;

  @BuiltValueField(wireName: r'tp1Hit')
  int get tp1Hit;

  @BuiltValueField(wireName: r'tp2Hit')
  int get tp2Hit;

  @BuiltValueField(wireName: r'slHit')
  int get slHit;

  @BuiltValueField(wireName: r'expired')
  int get expired;

  @BuiltValueField(wireName: r'invalidated')
  int get invalidated;

  @BuiltValueField(wireName: r'winRate')
  num? get winRate;

  @BuiltValueField(wireName: r'completionRate')
  num? get completionRate;

  @BuiltValueSerializer(custom: true)
  static Serializer<AnalysisHistoryOutcomeStats> get serializer => _$AnalysisHistoryOutcomeStatsSerializer();
}

class _$AnalysisHistoryOutcomeStatsSerializer implements PrimitiveSerializer<AnalysisHistoryOutcomeStats> {
  @override
  final Iterable<Type> types = const [AnalysisHistoryOutcomeStats];

  @override
  final String wireName = r'AnalysisHistoryOutcomeStats';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    AnalysisHistoryOutcomeStats object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'total';
    yield serializers.serialize(
      object.total,
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
    yield r'tp1Hit';
    yield serializers.serialize(
      object.tp1Hit,
      specifiedType: const FullType(int),
    );
    yield r'tp2Hit';
    yield serializers.serialize(
      object.tp2Hit,
      specifiedType: const FullType(int),
    );
    yield r'slHit';
    yield serializers.serialize(
      object.slHit,
      specifiedType: const FullType(int),
    );
    yield r'expired';
    yield serializers.serialize(
      object.expired,
      specifiedType: const FullType(int),
    );
    yield r'invalidated';
    yield serializers.serialize(
      object.invalidated,
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
  }

  @override
  Object serialize(
    Serializers serializers,
    AnalysisHistoryOutcomeStats object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  @override
  AnalysisHistoryOutcomeStats deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return serializers.deserialize(serialized, specifiedType: FullType($AnalysisHistoryOutcomeStats)) as $AnalysisHistoryOutcomeStats;
  }
}

/// a concrete implementation of [AnalysisHistoryOutcomeStats], since [AnalysisHistoryOutcomeStats] is not instantiable
@BuiltValue(instantiable: true)
abstract class $AnalysisHistoryOutcomeStats implements AnalysisHistoryOutcomeStats, Built<$AnalysisHistoryOutcomeStats, $AnalysisHistoryOutcomeStatsBuilder> {
  $AnalysisHistoryOutcomeStats._();

  factory $AnalysisHistoryOutcomeStats([void Function($AnalysisHistoryOutcomeStatsBuilder)? updates]) = _$$AnalysisHistoryOutcomeStats;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults($AnalysisHistoryOutcomeStatsBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<$AnalysisHistoryOutcomeStats> get serializer => _$$AnalysisHistoryOutcomeStatsSerializer();
}

class _$$AnalysisHistoryOutcomeStatsSerializer implements PrimitiveSerializer<$AnalysisHistoryOutcomeStats> {
  @override
  final Iterable<Type> types = const [$AnalysisHistoryOutcomeStats, _$$AnalysisHistoryOutcomeStats];

  @override
  final String wireName = r'$AnalysisHistoryOutcomeStats';

  @override
  Object serialize(
    Serializers serializers,
    $AnalysisHistoryOutcomeStats object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return serializers.serialize(object, specifiedType: FullType(AnalysisHistoryOutcomeStats))!;
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required AnalysisHistoryOutcomeStatsBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'total':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(int),
          ) as int;
          result.total = valueDes;
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
        case r'tp1Hit':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(int),
          ) as int;
          result.tp1Hit = valueDes;
          break;
        case r'tp2Hit':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(int),
          ) as int;
          result.tp2Hit = valueDes;
          break;
        case r'slHit':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(int),
          ) as int;
          result.slHit = valueDes;
          break;
        case r'expired':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(int),
          ) as int;
          result.expired = valueDes;
          break;
        case r'invalidated':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(int),
          ) as int;
          result.invalidated = valueDes;
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
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  $AnalysisHistoryOutcomeStats deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = $AnalysisHistoryOutcomeStatsBuilder();
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

