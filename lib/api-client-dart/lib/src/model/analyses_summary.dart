//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_collection/built_collection.dart';
import 'package:trade_pilot_api_client/src/model/analysis.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'analyses_summary.g.dart';

/// AnalysesSummary
///
/// Properties:
/// * [totalAnalyses] 
/// * [beginnerCount] 
/// * [proCount] 
/// * [avgConfidenceMin] 
/// * [avgConfidenceMax] 
/// * [recentAnalyses] 
@BuiltValue()
abstract class AnalysesSummary implements Built<AnalysesSummary, AnalysesSummaryBuilder> {
  @BuiltValueField(wireName: r'totalAnalyses')
  int get totalAnalyses;

  @BuiltValueField(wireName: r'beginnerCount')
  int get beginnerCount;

  @BuiltValueField(wireName: r'proCount')
  int get proCount;

  @BuiltValueField(wireName: r'avgConfidenceMin')
  num? get avgConfidenceMin;

  @BuiltValueField(wireName: r'avgConfidenceMax')
  num? get avgConfidenceMax;

  @BuiltValueField(wireName: r'recentAnalyses')
  BuiltList<Analysis> get recentAnalyses;

  AnalysesSummary._();

  factory AnalysesSummary([void updates(AnalysesSummaryBuilder b)]) = _$AnalysesSummary;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(AnalysesSummaryBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<AnalysesSummary> get serializer => _$AnalysesSummarySerializer();
}

class _$AnalysesSummarySerializer implements PrimitiveSerializer<AnalysesSummary> {
  @override
  final Iterable<Type> types = const [AnalysesSummary, _$AnalysesSummary];

  @override
  final String wireName = r'AnalysesSummary';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    AnalysesSummary object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'totalAnalyses';
    yield serializers.serialize(
      object.totalAnalyses,
      specifiedType: const FullType(int),
    );
    yield r'beginnerCount';
    yield serializers.serialize(
      object.beginnerCount,
      specifiedType: const FullType(int),
    );
    yield r'proCount';
    yield serializers.serialize(
      object.proCount,
      specifiedType: const FullType(int),
    );
    if (object.avgConfidenceMin != null) {
      yield r'avgConfidenceMin';
      yield serializers.serialize(
        object.avgConfidenceMin,
        specifiedType: const FullType(num),
      );
    }
    if (object.avgConfidenceMax != null) {
      yield r'avgConfidenceMax';
      yield serializers.serialize(
        object.avgConfidenceMax,
        specifiedType: const FullType(num),
      );
    }
    yield r'recentAnalyses';
    yield serializers.serialize(
      object.recentAnalyses,
      specifiedType: const FullType(BuiltList, [FullType(Analysis)]),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    AnalysesSummary object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required AnalysesSummaryBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'totalAnalyses':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(int),
          ) as int;
          result.totalAnalyses = valueDes;
          break;
        case r'beginnerCount':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(int),
          ) as int;
          result.beginnerCount = valueDes;
          break;
        case r'proCount':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(int),
          ) as int;
          result.proCount = valueDes;
          break;
        case r'avgConfidenceMin':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(num),
          ) as num?;
          if (valueDes == null) continue;
          result.avgConfidenceMin = valueDes;
          break;
        case r'avgConfidenceMax':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(num),
          ) as num?;
          if (valueDes == null) continue;
          result.avgConfidenceMax = valueDes;
          break;
        case r'recentAnalyses':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(BuiltList, [FullType(Analysis)]),
          ) as BuiltList<Analysis>;
          result.recentAnalyses.replace(valueDes);
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  AnalysesSummary deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = AnalysesSummaryBuilder();
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

