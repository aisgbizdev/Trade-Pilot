//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:trade_pilot_api_client/src/model/topup_user_summary.dart';
import 'package:built_collection/built_collection.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'topup_summary.g.dart';

/// TopupSummary
///
/// Properties:
/// * [totalAmountRupiah] 
/// * [totalCreditsGranted] 
/// * [approvedRequestCount] 
/// * [byUser] 
@BuiltValue()
abstract class TopupSummary implements Built<TopupSummary, TopupSummaryBuilder> {
  @BuiltValueField(wireName: r'totalAmountRupiah')
  int get totalAmountRupiah;

  @BuiltValueField(wireName: r'totalCreditsGranted')
  int get totalCreditsGranted;

  @BuiltValueField(wireName: r'approvedRequestCount')
  int get approvedRequestCount;

  @BuiltValueField(wireName: r'byUser')
  BuiltList<TopupUserSummary> get byUser;

  TopupSummary._();

  factory TopupSummary([void updates(TopupSummaryBuilder b)]) = _$TopupSummary;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(TopupSummaryBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<TopupSummary> get serializer => _$TopupSummarySerializer();
}

class _$TopupSummarySerializer implements PrimitiveSerializer<TopupSummary> {
  @override
  final Iterable<Type> types = const [TopupSummary, _$TopupSummary];

  @override
  final String wireName = r'TopupSummary';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    TopupSummary object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
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
    yield r'approvedRequestCount';
    yield serializers.serialize(
      object.approvedRequestCount,
      specifiedType: const FullType(int),
    );
    yield r'byUser';
    yield serializers.serialize(
      object.byUser,
      specifiedType: const FullType(BuiltList, [FullType(TopupUserSummary)]),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    TopupSummary object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required TopupSummaryBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
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
        case r'approvedRequestCount':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(int),
          ) as int;
          result.approvedRequestCount = valueDes;
          break;
        case r'byUser':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(BuiltList, [FullType(TopupUserSummary)]),
          ) as BuiltList<TopupUserSummary>;
          result.byUser.replace(valueDes);
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  TopupSummary deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = TopupSummaryBuilder();
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

