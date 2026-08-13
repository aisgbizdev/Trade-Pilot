//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'analysis_outcomes_summary.g.dart';

/// Outcome roll-up powering the dashboard's AI accuracy card. Counts every analysis created in the last `rangeDays` days; `scored` is the resolved + non-invalidated subset that the hit-rate percentages are computed against.
///
/// Properties:
/// * [rangeDays] 
/// * [total] 
/// * [pending] 
/// * [tp1Hit] 
/// * [tp2Hit] 
/// * [slHit] 
/// * [expired] 
/// * [invalidated] 
/// * [scored] - Denominator used for tpHitRate / slHitRate. Equals tp1Hit + tp2Hit + slHit + expired (excludes pending and invalidated).
/// * [tpHitRate] - (tp1Hit + tp2Hit) / scored. Null when scored == 0.
/// * [slHitRate] - slHit / scored. Null when scored == 0.
@BuiltValue()
abstract class AnalysisOutcomesSummary implements Built<AnalysisOutcomesSummary, AnalysisOutcomesSummaryBuilder> {
  @BuiltValueField(wireName: r'rangeDays')
  int get rangeDays;

  @BuiltValueField(wireName: r'total')
  int get total;

  @BuiltValueField(wireName: r'pending')
  int get pending;

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

  /// Denominator used for tpHitRate / slHitRate. Equals tp1Hit + tp2Hit + slHit + expired (excludes pending and invalidated).
  @BuiltValueField(wireName: r'scored')
  int get scored;

  /// (tp1Hit + tp2Hit) / scored. Null when scored == 0.
  @BuiltValueField(wireName: r'tpHitRate')
  num? get tpHitRate;

  /// slHit / scored. Null when scored == 0.
  @BuiltValueField(wireName: r'slHitRate')
  num? get slHitRate;

  AnalysisOutcomesSummary._();

  factory AnalysisOutcomesSummary([void updates(AnalysisOutcomesSummaryBuilder b)]) = _$AnalysisOutcomesSummary;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(AnalysisOutcomesSummaryBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<AnalysisOutcomesSummary> get serializer => _$AnalysisOutcomesSummarySerializer();
}

class _$AnalysisOutcomesSummarySerializer implements PrimitiveSerializer<AnalysisOutcomesSummary> {
  @override
  final Iterable<Type> types = const [AnalysisOutcomesSummary, _$AnalysisOutcomesSummary];

  @override
  final String wireName = r'AnalysisOutcomesSummary';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    AnalysisOutcomesSummary object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'rangeDays';
    yield serializers.serialize(
      object.rangeDays,
      specifiedType: const FullType(int),
    );
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
    yield r'scored';
    yield serializers.serialize(
      object.scored,
      specifiedType: const FullType(int),
    );
    if (object.tpHitRate != null) {
      yield r'tpHitRate';
      yield serializers.serialize(
        object.tpHitRate,
        specifiedType: const FullType(num),
      );
    }
    if (object.slHitRate != null) {
      yield r'slHitRate';
      yield serializers.serialize(
        object.slHitRate,
        specifiedType: const FullType(num),
      );
    }
  }

  @override
  Object serialize(
    Serializers serializers,
    AnalysisOutcomesSummary object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required AnalysisOutcomesSummaryBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'rangeDays':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(int),
          ) as int;
          result.rangeDays = valueDes;
          break;
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
        case r'scored':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(int),
          ) as int;
          result.scored = valueDes;
          break;
        case r'tpHitRate':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(num),
          ) as num?;
          if (valueDes == null) continue;
          result.tpHitRate = valueDes;
          break;
        case r'slHitRate':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(num),
          ) as num?;
          if (valueDes == null) continue;
          result.slHitRate = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  AnalysisOutcomesSummary deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = AnalysisOutcomesSummaryBuilder();
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

