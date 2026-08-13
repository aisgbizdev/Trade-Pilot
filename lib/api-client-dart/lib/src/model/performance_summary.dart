//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_collection/built_collection.dart';
import 'package:trade_pilot_api_client/src/model/performance_overall.dart';
import 'package:trade_pilot_api_client/src/model/performance_min_samples.dart';
import 'package:trade_pilot_api_client/src/model/performance_banner.dart';
import 'package:trade_pilot_api_client/src/model/performance_segment.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'performance_summary.g.dart';

/// Public AI transparency snapshot for the rolling `windowDays` window (task #164).
///
/// Properties:
/// * [windowDays] 
/// * [generatedAt] 
/// * [windowStart] 
/// * [minSamples] 
/// * [overall] 
/// * [banner] 
/// * [byInstrument] 
/// * [bySession] 
/// * [byCondition] 
/// * [byVolatility] - Deterministic regime classification derived from the stored indicator tally (trending / ranging / choppy). Replaces ADX where raw OHLC isn't kept per analysis.
/// * [byNewsActivity] - news_week vs quiet_week, derived from whether the AI's fundamental snapshot included any high-impact calendar event at analysis time.
@BuiltValue()
abstract class PerformanceSummary implements Built<PerformanceSummary, PerformanceSummaryBuilder> {
  @BuiltValueField(wireName: r'windowDays')
  PerformanceSummaryWindowDaysEnum get windowDays;
  // enum windowDaysEnum {  30,  90,  };

  @BuiltValueField(wireName: r'generatedAt')
  DateTime get generatedAt;

  @BuiltValueField(wireName: r'windowStart')
  DateTime get windowStart;

  @BuiltValueField(wireName: r'minSamples')
  PerformanceMinSamples get minSamples;

  @BuiltValueField(wireName: r'overall')
  PerformanceOverall get overall;

  @BuiltValueField(wireName: r'banner')
  PerformanceBanner get banner;

  @BuiltValueField(wireName: r'byInstrument')
  PerformanceSegment get byInstrument;

  @BuiltValueField(wireName: r'bySession')
  PerformanceSegment get bySession;

  @BuiltValueField(wireName: r'byCondition')
  PerformanceSegment get byCondition;

  /// Deterministic regime classification derived from the stored indicator tally (trending / ranging / choppy). Replaces ADX where raw OHLC isn't kept per analysis.
  @BuiltValueField(wireName: r'byVolatility')
  PerformanceSegment get byVolatility;

  /// news_week vs quiet_week, derived from whether the AI's fundamental snapshot included any high-impact calendar event at analysis time.
  @BuiltValueField(wireName: r'byNewsActivity')
  PerformanceSegment get byNewsActivity;

  PerformanceSummary._();

  factory PerformanceSummary([void updates(PerformanceSummaryBuilder b)]) = _$PerformanceSummary;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(PerformanceSummaryBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<PerformanceSummary> get serializer => _$PerformanceSummarySerializer();
}

class _$PerformanceSummarySerializer implements PrimitiveSerializer<PerformanceSummary> {
  @override
  final Iterable<Type> types = const [PerformanceSummary, _$PerformanceSummary];

  @override
  final String wireName = r'PerformanceSummary';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    PerformanceSummary object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'windowDays';
    yield serializers.serialize(
      object.windowDays,
      specifiedType: const FullType(PerformanceSummaryWindowDaysEnum),
    );
    yield r'generatedAt';
    yield serializers.serialize(
      object.generatedAt,
      specifiedType: const FullType(DateTime),
    );
    yield r'windowStart';
    yield serializers.serialize(
      object.windowStart,
      specifiedType: const FullType(DateTime),
    );
    yield r'minSamples';
    yield serializers.serialize(
      object.minSamples,
      specifiedType: const FullType(PerformanceMinSamples),
    );
    yield r'overall';
    yield serializers.serialize(
      object.overall,
      specifiedType: const FullType(PerformanceOverall),
    );
    yield r'banner';
    yield serializers.serialize(
      object.banner,
      specifiedType: const FullType(PerformanceBanner),
    );
    yield r'byInstrument';
    yield serializers.serialize(
      object.byInstrument,
      specifiedType: const FullType(PerformanceSegment),
    );
    yield r'bySession';
    yield serializers.serialize(
      object.bySession,
      specifiedType: const FullType(PerformanceSegment),
    );
    yield r'byCondition';
    yield serializers.serialize(
      object.byCondition,
      specifiedType: const FullType(PerformanceSegment),
    );
    yield r'byVolatility';
    yield serializers.serialize(
      object.byVolatility,
      specifiedType: const FullType(PerformanceSegment),
    );
    yield r'byNewsActivity';
    yield serializers.serialize(
      object.byNewsActivity,
      specifiedType: const FullType(PerformanceSegment),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    PerformanceSummary object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required PerformanceSummaryBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'windowDays':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(PerformanceSummaryWindowDaysEnum),
          ) as PerformanceSummaryWindowDaysEnum;
          result.windowDays = valueDes;
          break;
        case r'generatedAt':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(DateTime),
          ) as DateTime;
          result.generatedAt = valueDes;
          break;
        case r'windowStart':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(DateTime),
          ) as DateTime;
          result.windowStart = valueDes;
          break;
        case r'minSamples':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(PerformanceMinSamples),
          ) as PerformanceMinSamples;
          result.minSamples.replace(valueDes);
          break;
        case r'overall':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(PerformanceOverall),
          ) as PerformanceOverall;
          result.overall.replace(valueDes);
          break;
        case r'banner':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(PerformanceBanner),
          ) as PerformanceBanner;
          result.banner.replace(valueDes);
          break;
        case r'byInstrument':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(PerformanceSegment),
          ) as PerformanceSegment;
          result.byInstrument.replace(valueDes);
          break;
        case r'bySession':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(PerformanceSegment),
          ) as PerformanceSegment;
          result.bySession.replace(valueDes);
          break;
        case r'byCondition':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(PerformanceSegment),
          ) as PerformanceSegment;
          result.byCondition.replace(valueDes);
          break;
        case r'byVolatility':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(PerformanceSegment),
          ) as PerformanceSegment;
          result.byVolatility.replace(valueDes);
          break;
        case r'byNewsActivity':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(PerformanceSegment),
          ) as PerformanceSegment;
          result.byNewsActivity.replace(valueDes);
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  PerformanceSummary deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = PerformanceSummaryBuilder();
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

class PerformanceSummaryWindowDaysEnum extends EnumClass {

  @BuiltValueEnumConst(wireNumber: 30)
  static const PerformanceSummaryWindowDaysEnum number30 = _$performanceSummaryWindowDaysEnum_number30;
  @BuiltValueEnumConst(wireNumber: 90)
  static const PerformanceSummaryWindowDaysEnum number90 = _$performanceSummaryWindowDaysEnum_number90;

  static Serializer<PerformanceSummaryWindowDaysEnum> get serializer => _$performanceSummaryWindowDaysEnumSerializer;

  const PerformanceSummaryWindowDaysEnum._(String name): super(name);

  static BuiltSet<PerformanceSummaryWindowDaysEnum> get values => _$performanceSummaryWindowDaysEnumValues;
  static PerformanceSummaryWindowDaysEnum valueOf(String name) => _$performanceSummaryWindowDaysEnumValueOf(name);
}

