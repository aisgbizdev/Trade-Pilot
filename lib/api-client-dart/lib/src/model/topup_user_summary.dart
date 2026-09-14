//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'topup_user_summary.g.dart';

/// TopupUserSummary
///
/// Properties:
/// * [userId] 
/// * [userEmail] 
/// * [userDisplayName] 
/// * [totalAmountRupiah] 
/// * [totalCreditsGranted] 
/// * [requestCount] 
/// * [lastApprovedAt] 
@BuiltValue()
abstract class TopupUserSummary implements Built<TopupUserSummary, TopupUserSummaryBuilder> {
  @BuiltValueField(wireName: r'userId')
  int get userId;

  @BuiltValueField(wireName: r'userEmail')
  String get userEmail;

  @BuiltValueField(wireName: r'userDisplayName')
  String get userDisplayName;

  @BuiltValueField(wireName: r'totalAmountRupiah')
  int get totalAmountRupiah;

  @BuiltValueField(wireName: r'totalCreditsGranted')
  int get totalCreditsGranted;

  @BuiltValueField(wireName: r'requestCount')
  int get requestCount;

  @BuiltValueField(wireName: r'lastApprovedAt')
  DateTime get lastApprovedAt;

  TopupUserSummary._();

  factory TopupUserSummary([void updates(TopupUserSummaryBuilder b)]) = _$TopupUserSummary;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(TopupUserSummaryBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<TopupUserSummary> get serializer => _$TopupUserSummarySerializer();
}

class _$TopupUserSummarySerializer implements PrimitiveSerializer<TopupUserSummary> {
  @override
  final Iterable<Type> types = const [TopupUserSummary, _$TopupUserSummary];

  @override
  final String wireName = r'TopupUserSummary';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    TopupUserSummary object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'userId';
    yield serializers.serialize(
      object.userId,
      specifiedType: const FullType(int),
    );
    yield r'userEmail';
    yield serializers.serialize(
      object.userEmail,
      specifiedType: const FullType(String),
    );
    yield r'userDisplayName';
    yield serializers.serialize(
      object.userDisplayName,
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
    yield r'lastApprovedAt';
    yield serializers.serialize(
      object.lastApprovedAt,
      specifiedType: const FullType(DateTime),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    TopupUserSummary object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required TopupUserSummaryBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'userId':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(int),
          ) as int;
          result.userId = valueDes;
          break;
        case r'userEmail':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.userEmail = valueDes;
          break;
        case r'userDisplayName':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.userDisplayName = valueDes;
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
        case r'lastApprovedAt':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(DateTime),
          ) as DateTime;
          result.lastApprovedAt = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  TopupUserSummary deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = TopupUserSummaryBuilder();
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

