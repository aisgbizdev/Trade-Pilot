//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'topup_month_summary.g.dart';

/// TopupMonthSummary
///
/// Properties:
/// * [month] - Calendar month (Asia/Jakarta) the top-up was approved in, as YYYY-MM.
/// * [totalAmountRupiah] 
/// * [totalCreditsGranted] 
/// * [requestCount] 
@BuiltValue()
abstract class TopupMonthSummary implements Built<TopupMonthSummary, TopupMonthSummaryBuilder> {
  /// Calendar month (Asia/Jakarta) the top-up was approved in, as YYYY-MM.
  @BuiltValueField(wireName: r'month')
  String get month;

  @BuiltValueField(wireName: r'totalAmountRupiah')
  int get totalAmountRupiah;

  @BuiltValueField(wireName: r'totalCreditsGranted')
  int get totalCreditsGranted;

  @BuiltValueField(wireName: r'requestCount')
  int get requestCount;

  TopupMonthSummary._();

  factory TopupMonthSummary([void updates(TopupMonthSummaryBuilder b)]) = _$TopupMonthSummary;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(TopupMonthSummaryBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<TopupMonthSummary> get serializer => _$TopupMonthSummarySerializer();
}

class _$TopupMonthSummarySerializer implements PrimitiveSerializer<TopupMonthSummary> {
  @override
  final Iterable<Type> types = const [TopupMonthSummary, _$TopupMonthSummary];

  @override
  final String wireName = r'TopupMonthSummary';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    TopupMonthSummary object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'month';
    yield serializers.serialize(
      object.month,
      specifiedType: const FullType(String),
    );
    yield r'totalAmountRupiah';
    yield serializers.serialize(
      object.totalAmountRupiah,
      specifiedType: const FullType(int),
    );
    yield r'totalCreditsGranted';
    yield serializers.serialize(
      object.totalCreditsGranted,
      specifiedType: const FullType(int),
    );
    yield r'requestCount';
    yield serializers.serialize(
      object.requestCount,
      specifiedType: const FullType(int),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    TopupMonthSummary object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required TopupMonthSummaryBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'month':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.month = valueDes;
          break;
        case r'totalAmountRupiah':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(int),
          ) as int;
          result.totalAmountRupiah = valueDes;
          break;
        case r'totalCreditsGranted':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(int),
          ) as int;
          result.totalCreditsGranted = valueDes;
          break;
        case r'requestCount':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(int),
          ) as int;
          result.requestCount = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  TopupMonthSummary deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = TopupMonthSummaryBuilder();
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

