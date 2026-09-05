//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:trade_pilot_api_client/src/model/analysis_history_instrument_stats.dart';
import 'package:trade_pilot_api_client/src/model/analysis_history_timeframe_stats.dart';
import 'package:built_collection/built_collection.dart';
import 'package:trade_pilot_api_client/src/model/analysis_history_outcome_stats.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'analysis_history_summary.g.dart';

/// AnalysisHistorySummary
///
/// Properties:
/// * [range] 
/// * [minSamples] 
/// * [overall] 
/// * [byInstrument] 
/// * [byTimeframe] 
@BuiltValue()
abstract class AnalysisHistorySummary implements Built<AnalysisHistorySummary, AnalysisHistorySummaryBuilder> {
  @BuiltValueField(wireName: r'range')
  AnalysisHistorySummaryRangeEnum get range;
  // enum rangeEnum {  7,  30,  90,  all,  };

  @BuiltValueField(wireName: r'minSamples')
  int get minSamples;

  @BuiltValueField(wireName: r'overall')
  AnalysisHistoryOutcomeStats get overall;

  @BuiltValueField(wireName: r'byInstrument')
  BuiltList<AnalysisHistoryInstrumentStats> get byInstrument;

  @BuiltValueField(wireName: r'byTimeframe')
  BuiltList<AnalysisHistoryTimeframeStats> get byTimeframe;

  AnalysisHistorySummary._();

  factory AnalysisHistorySummary([void updates(AnalysisHistorySummaryBuilder b)]) = _$AnalysisHistorySummary;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(AnalysisHistorySummaryBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<AnalysisHistorySummary> get serializer => _$AnalysisHistorySummarySerializer();
}

class _$AnalysisHistorySummarySerializer implements PrimitiveSerializer<AnalysisHistorySummary> {
  @override
  final Iterable<Type> types = const [AnalysisHistorySummary, _$AnalysisHistorySummary];

  @override
  final String wireName = r'AnalysisHistorySummary';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    AnalysisHistorySummary object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'range';
    yield serializers.serialize(
      object.range,
      specifiedType: const FullType(AnalysisHistorySummaryRangeEnum),
    );
    yield r'minSamples';
    yield serializers.serialize(
      object.minSamples,
      specifiedType: const FullType(int),
    );
    yield r'overall';
    yield serializers.serialize(
      object.overall,
      specifiedType: const FullType(AnalysisHistoryOutcomeStats),
    );
    yield r'byInstrument';
    yield serializers.serialize(
      object.byInstrument,
      specifiedType: const FullType(BuiltList, [FullType(AnalysisHistoryInstrumentStats)]),
    );
    yield r'byTimeframe';
    yield serializers.serialize(
      object.byTimeframe,
      specifiedType: const FullType(BuiltList, [FullType(AnalysisHistoryTimeframeStats)]),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    AnalysisHistorySummary object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required AnalysisHistorySummaryBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'range':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(AnalysisHistorySummaryRangeEnum),
          ) as AnalysisHistorySummaryRangeEnum;
          result.range = valueDes;
          break;
        case r'minSamples':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(int),
          ) as int;
          result.minSamples = valueDes;
          break;
        case r'overall':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(AnalysisHistoryOutcomeStats),
          ) as AnalysisHistoryOutcomeStats;
          result.overall = valueDes;
          break;
        case r'byInstrument':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(BuiltList, [FullType(AnalysisHistoryInstrumentStats)]),
          ) as BuiltList<AnalysisHistoryInstrumentStats>;
          result.byInstrument.replace(valueDes);
          break;
        case r'byTimeframe':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(BuiltList, [FullType(AnalysisHistoryTimeframeStats)]),
          ) as BuiltList<AnalysisHistoryTimeframeStats>;
          result.byTimeframe.replace(valueDes);
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  AnalysisHistorySummary deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = AnalysisHistorySummaryBuilder();
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

class AnalysisHistorySummaryRangeEnum extends EnumClass {

  @BuiltValueEnumConst(wireName: r'7')
  static const AnalysisHistorySummaryRangeEnum n7 = _$analysisHistorySummaryRangeEnum_n7;
  @BuiltValueEnumConst(wireName: r'30')
  static const AnalysisHistorySummaryRangeEnum n30 = _$analysisHistorySummaryRangeEnum_n30;
  @BuiltValueEnumConst(wireName: r'90')
  static const AnalysisHistorySummaryRangeEnum n90 = _$analysisHistorySummaryRangeEnum_n90;
  @BuiltValueEnumConst(wireName: r'all')
  static const AnalysisHistorySummaryRangeEnum all = _$analysisHistorySummaryRangeEnum_all;

  static Serializer<AnalysisHistorySummaryRangeEnum> get serializer => _$analysisHistorySummaryRangeEnumSerializer;

  const AnalysisHistorySummaryRangeEnum._(String name): super(name);

  static BuiltSet<AnalysisHistorySummaryRangeEnum> get values => _$analysisHistorySummaryRangeEnumValues;
  static AnalysisHistorySummaryRangeEnum valueOf(String name) => _$analysisHistorySummaryRangeEnumValueOf(name);
}

