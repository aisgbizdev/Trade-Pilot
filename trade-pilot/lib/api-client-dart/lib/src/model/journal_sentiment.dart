//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'journal_sentiment.g.dart';

/// Anonymised long-vs-short aggregate for an instrument over the last `windowDays`, gated when sample is too small to safely de-identify.
///
/// Properties:
/// * [instrument] 
/// * [windowDays] 
/// * [minSampleSize] 
/// * [minDistinctTraders] 
/// * [sampleSize] - Number of directional (buy/sell) entries in the window. Null when `gated` is true (suppressed to prevent membership inference on thin instruments).
/// * [distinctTraders] - Number of distinct user IDs contributing entries. Null when `gated` is true.
/// * [gated] - True when sample is below thresholds; percentages, sampleSize, and distinctTraders are all null.
/// * [buyPct] 
/// * [sellPct] 
@BuiltValue()
abstract class JournalSentiment implements Built<JournalSentiment, JournalSentimentBuilder> {
  @BuiltValueField(wireName: r'instrument')
  String get instrument;

  @BuiltValueField(wireName: r'windowDays')
  int get windowDays;

  @BuiltValueField(wireName: r'minSampleSize')
  int get minSampleSize;

  @BuiltValueField(wireName: r'minDistinctTraders')
  int get minDistinctTraders;

  /// Number of directional (buy/sell) entries in the window. Null when `gated` is true (suppressed to prevent membership inference on thin instruments).
  @BuiltValueField(wireName: r'sampleSize')
  int get sampleSize;

  /// Number of distinct user IDs contributing entries. Null when `gated` is true.
  @BuiltValueField(wireName: r'distinctTraders')
  int get distinctTraders;

  /// True when sample is below thresholds; percentages, sampleSize, and distinctTraders are all null.
  @BuiltValueField(wireName: r'gated')
  bool get gated;

  @BuiltValueField(wireName: r'buyPct')
  int get buyPct;

  @BuiltValueField(wireName: r'sellPct')
  int get sellPct;

  JournalSentiment._();

  factory JournalSentiment([void updates(JournalSentimentBuilder b)]) = _$JournalSentiment;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(JournalSentimentBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<JournalSentiment> get serializer => _$JournalSentimentSerializer();
}

class _$JournalSentimentSerializer implements PrimitiveSerializer<JournalSentiment> {
  @override
  final Iterable<Type> types = const [JournalSentiment, _$JournalSentiment];

  @override
  final String wireName = r'JournalSentiment';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    JournalSentiment object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'instrument';
    yield serializers.serialize(
      object.instrument,
      specifiedType: const FullType(String),
    );
    yield r'windowDays';
    yield serializers.serialize(
      object.windowDays,
      specifiedType: const FullType(int),
    );
    yield r'minSampleSize';
    yield serializers.serialize(
      object.minSampleSize,
      specifiedType: const FullType(int),
    );
    yield r'minDistinctTraders';
    yield serializers.serialize(
      object.minDistinctTraders,
      specifiedType: const FullType(int),
    );
    yield r'sampleSize';
    yield serializers.serialize(
      object.sampleSize,
      specifiedType: const FullType(int),
    );
    yield r'distinctTraders';
    yield serializers.serialize(
      object.distinctTraders,
      specifiedType: const FullType(int),
    );
    yield r'gated';
    yield serializers.serialize(
      object.gated,
      specifiedType: const FullType(bool),
    );
    yield r'buyPct';
    yield serializers.serialize(
      object.buyPct,
      specifiedType: const FullType(int),
    );
    yield r'sellPct';
    yield serializers.serialize(
      object.sellPct,
      specifiedType: const FullType(int),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    JournalSentiment object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required JournalSentimentBuilder result,
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
        case r'windowDays':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(int),
          ) as int;
          result.windowDays = valueDes;
          break;
        case r'minSampleSize':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(int),
          ) as int;
          result.minSampleSize = valueDes;
          break;
        case r'minDistinctTraders':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(int),
          ) as int;
          result.minDistinctTraders = valueDes;
          break;
        case r'sampleSize':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(int),
          ) as int;
          result.sampleSize = valueDes;
          break;
        case r'distinctTraders':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(int),
          ) as int;
          result.distinctTraders = valueDes;
          break;
        case r'gated':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(bool),
          ) as bool;
          result.gated = valueDes;
          break;
        case r'buyPct':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(int),
          ) as int;
          result.buyPct = valueDes;
          break;
        case r'sellPct':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(int),
          ) as int;
          result.sellPct = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  JournalSentiment deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = JournalSentimentBuilder();
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

