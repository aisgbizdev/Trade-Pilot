//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'daily_summary_analysis.g.dart';

/// DailySummaryAnalysis
///
/// Properties:
/// * [id] 
/// * [instrument] 
/// * [timeframe] 
/// * [tradingBias] 
/// * [confidenceMin] 
/// * [confidenceMax] 
/// * [preferredSide] 
/// * [mainScenario] 
/// * [createdAt] 
@BuiltValue()
abstract class DailySummaryAnalysis implements Built<DailySummaryAnalysis, DailySummaryAnalysisBuilder> {
  @BuiltValueField(wireName: r'id')
  int get id;

  @BuiltValueField(wireName: r'instrument')
  String get instrument;

  @BuiltValueField(wireName: r'timeframe')
  String get timeframe;

  @BuiltValueField(wireName: r'tradingBias')
  String? get tradingBias;

  @BuiltValueField(wireName: r'confidenceMin')
  int? get confidenceMin;

  @BuiltValueField(wireName: r'confidenceMax')
  int? get confidenceMax;

  @BuiltValueField(wireName: r'preferredSide')
  String? get preferredSide;

  @BuiltValueField(wireName: r'mainScenario')
  String? get mainScenario;

  @BuiltValueField(wireName: r'createdAt')
  DateTime get createdAt;

  DailySummaryAnalysis._();

  factory DailySummaryAnalysis([void updates(DailySummaryAnalysisBuilder b)]) = _$DailySummaryAnalysis;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(DailySummaryAnalysisBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<DailySummaryAnalysis> get serializer => _$DailySummaryAnalysisSerializer();
}

class _$DailySummaryAnalysisSerializer implements PrimitiveSerializer<DailySummaryAnalysis> {
  @override
  final Iterable<Type> types = const [DailySummaryAnalysis, _$DailySummaryAnalysis];

  @override
  final String wireName = r'DailySummaryAnalysis';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    DailySummaryAnalysis object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'id';
    yield serializers.serialize(
      object.id,
      specifiedType: const FullType(int),
    );
    yield r'instrument';
    yield serializers.serialize(
      object.instrument,
      specifiedType: const FullType(String),
    );
    yield r'timeframe';
    yield serializers.serialize(
      object.timeframe,
      specifiedType: const FullType(String),
    );
    if (object.tradingBias != null) {
      yield r'tradingBias';
      yield serializers.serialize(
        object.tradingBias,
        specifiedType: const FullType(String),
      );
    }
    if (object.confidenceMin != null) {
      yield r'confidenceMin';
      yield serializers.serialize(
        object.confidenceMin,
        specifiedType: const FullType(int),
      );
    }
    if (object.confidenceMax != null) {
      yield r'confidenceMax';
      yield serializers.serialize(
        object.confidenceMax,
        specifiedType: const FullType(int),
      );
    }
    if (object.preferredSide != null) {
      yield r'preferredSide';
      yield serializers.serialize(
        object.preferredSide,
        specifiedType: const FullType(String),
      );
    }
    if (object.mainScenario != null) {
      yield r'mainScenario';
      yield serializers.serialize(
        object.mainScenario,
        specifiedType: const FullType(String),
      );
    }
    yield r'createdAt';
    yield serializers.serialize(
      object.createdAt,
      specifiedType: const FullType(DateTime),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    DailySummaryAnalysis object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required DailySummaryAnalysisBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'id':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(int),
          ) as int;
          result.id = valueDes;
          break;
        case r'instrument':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.instrument = valueDes;
          break;
        case r'timeframe':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.timeframe = valueDes;
          break;
        case r'tradingBias':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.tradingBias = valueDes;
          break;
        case r'confidenceMin':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(int),
          ) as int?;
          if (valueDes == null) continue;
          result.confidenceMin = valueDes;
          break;
        case r'confidenceMax':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(int),
          ) as int?;
          if (valueDes == null) continue;
          result.confidenceMax = valueDes;
          break;
        case r'preferredSide':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.preferredSide = valueDes;
          break;
        case r'mainScenario':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.mainScenario = valueDes;
          break;
        case r'createdAt':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(DateTime),
          ) as DateTime;
          result.createdAt = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  DailySummaryAnalysis deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = DailySummaryAnalysisBuilder();
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

