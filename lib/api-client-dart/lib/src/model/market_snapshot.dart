//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:trade_pilot_api_client/src/model/market_snapshot_candle.dart';
import 'package:built_collection/built_collection.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'market_snapshot.g.dart';

/// Selected-timeframe candle snapshot captured during analysis creation. sourceStatus identifies stale or unavailable source data; sourceFetchedAt is null when no source candles were retrieved.
///
/// Properties:
/// * [instrument] 
/// * [timeframe] 
/// * [capturedAt] 
/// * [sourceFetchedAt] 
/// * [candles] 
/// * [priceAtAnalysis] - Exact price anchor passed to AI generation, when available.
/// * [sourceStatus] 
@BuiltValue()
abstract class MarketSnapshot implements Built<MarketSnapshot, MarketSnapshotBuilder> {
  @BuiltValueField(wireName: r'instrument')
  String get instrument;

  @BuiltValueField(wireName: r'timeframe')
  String get timeframe;

  @BuiltValueField(wireName: r'capturedAt')
  DateTime get capturedAt;

  @BuiltValueField(wireName: r'sourceFetchedAt')
  DateTime get sourceFetchedAt;

  @BuiltValueField(wireName: r'candles')
  BuiltList<MarketSnapshotCandle> get candles;

  /// Exact price anchor passed to AI generation, when available.
  @BuiltValueField(wireName: r'priceAtAnalysis')
  num get priceAtAnalysis;

  @BuiltValueField(wireName: r'sourceStatus')
  MarketSnapshotSourceStatusEnum get sourceStatus;
  // enum sourceStatusEnum {  fresh,  stale_source_age,  stale_feed_unavailable,  feed_unavailable,  };

  MarketSnapshot._();

  factory MarketSnapshot([void updates(MarketSnapshotBuilder b)]) = _$MarketSnapshot;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(MarketSnapshotBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<MarketSnapshot> get serializer => _$MarketSnapshotSerializer();
}

class _$MarketSnapshotSerializer implements PrimitiveSerializer<MarketSnapshot> {
  @override
  final Iterable<Type> types = const [MarketSnapshot, _$MarketSnapshot];

  @override
  final String wireName = r'MarketSnapshot';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    MarketSnapshot object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
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
    yield r'capturedAt';
    yield serializers.serialize(
      object.capturedAt,
      specifiedType: const FullType(DateTime),
    );
    yield r'sourceFetchedAt';
    yield serializers.serialize(
      object.sourceFetchedAt,
      specifiedType: const FullType(DateTime),
    );
    yield r'candles';
    yield serializers.serialize(
      object.candles,
      specifiedType: const FullType(BuiltList, [FullType(MarketSnapshotCandle)]),
    );
    yield r'priceAtAnalysis';
    yield serializers.serialize(
      object.priceAtAnalysis,
      specifiedType: const FullType(num),
    );
    yield r'sourceStatus';
    yield serializers.serialize(
      object.sourceStatus,
      specifiedType: const FullType(MarketSnapshotSourceStatusEnum),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    MarketSnapshot object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required MarketSnapshotBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
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
        case r'capturedAt':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(DateTime),
          ) as DateTime;
          result.capturedAt = valueDes;
          break;
        case r'sourceFetchedAt':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(DateTime),
          ) as DateTime;
          result.sourceFetchedAt = valueDes;
          break;
        case r'candles':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(BuiltList, [FullType(MarketSnapshotCandle)]),
          ) as BuiltList<MarketSnapshotCandle>;
          result.candles.replace(valueDes);
          break;
        case r'priceAtAnalysis':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(num),
          ) as num;
          result.priceAtAnalysis = valueDes;
          break;
        case r'sourceStatus':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(MarketSnapshotSourceStatusEnum),
          ) as MarketSnapshotSourceStatusEnum;
          result.sourceStatus = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  MarketSnapshot deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = MarketSnapshotBuilder();
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

class MarketSnapshotSourceStatusEnum extends EnumClass {

  @BuiltValueEnumConst(wireName: r'fresh')
  static const MarketSnapshotSourceStatusEnum fresh = _$marketSnapshotSourceStatusEnum_fresh;
  @BuiltValueEnumConst(wireName: r'stale_source_age')
  static const MarketSnapshotSourceStatusEnum staleSourceAge = _$marketSnapshotSourceStatusEnum_staleSourceAge;
  @BuiltValueEnumConst(wireName: r'stale_feed_unavailable')
  static const MarketSnapshotSourceStatusEnum staleFeedUnavailable = _$marketSnapshotSourceStatusEnum_staleFeedUnavailable;
  @BuiltValueEnumConst(wireName: r'feed_unavailable')
  static const MarketSnapshotSourceStatusEnum feedUnavailable = _$marketSnapshotSourceStatusEnum_feedUnavailable;

  static Serializer<MarketSnapshotSourceStatusEnum> get serializer => _$marketSnapshotSourceStatusEnumSerializer;

  const MarketSnapshotSourceStatusEnum._(String name): super(name);

  static BuiltSet<MarketSnapshotSourceStatusEnum> get values => _$marketSnapshotSourceStatusEnumValues;
  static MarketSnapshotSourceStatusEnum valueOf(String name) => _$marketSnapshotSourceStatusEnumValueOf(name);
}

