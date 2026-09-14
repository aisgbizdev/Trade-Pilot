//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:trade_pilot_api_client/src/model/topup_request_status.dart';
import 'package:trade_pilot_api_client/src/model/topup_request.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'topup_request_with_user.g.dart';

/// TopupRequestWithUser
///
/// Properties:
/// * [id] 
/// * [userId] 
/// * [amountRupiah] 
/// * [creditsRequested] 
/// * [conversionRateSnapshot] 
/// * [paymentReferenceNote] 
/// * [proofObjectPath] 
/// * [status] 
/// * [reviewedByUserId] 
/// * [reviewedAt] 
/// * [reviewNote] 
/// * [creditsGranted] 
/// * [createdAt] 
/// * [userEmail] 
/// * [userDisplayName] 
@BuiltValue()
abstract class TopupRequestWithUser implements TopupRequest, Built<TopupRequestWithUser, TopupRequestWithUserBuilder> {
  @BuiltValueField(wireName: r'userDisplayName')
  String get userDisplayName;

  @BuiltValueField(wireName: r'userEmail')
  String get userEmail;

  TopupRequestWithUser._();

  factory TopupRequestWithUser([void updates(TopupRequestWithUserBuilder b)]) = _$TopupRequestWithUser;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(TopupRequestWithUserBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<TopupRequestWithUser> get serializer => _$TopupRequestWithUserSerializer();
}

class _$TopupRequestWithUserSerializer implements PrimitiveSerializer<TopupRequestWithUser> {
  @override
  final Iterable<Type> types = const [TopupRequestWithUser, _$TopupRequestWithUser];

  @override
  final String wireName = r'TopupRequestWithUser';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    TopupRequestWithUser object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'creditsGranted';
    yield serializers.serialize(
      object.creditsGranted,
      specifiedType: const FullType(int),
    );
    yield r'creditsRequested';
    yield serializers.serialize(
      object.creditsRequested,
      specifiedType: const FullType(int),
    );
    yield r'reviewedAt';
    yield serializers.serialize(
      object.reviewedAt,
      specifiedType: const FullType(DateTime),
    );
    yield r'userDisplayName';
    yield serializers.serialize(
      object.userDisplayName,
      specifiedType: const FullType(String),
    );
    yield r'userId';
    yield serializers.serialize(
      object.userId,
      specifiedType: const FullType(int),
    );
    yield r'conversionRateSnapshot';
    yield serializers.serialize(
      object.conversionRateSnapshot,
      specifiedType: const FullType(int),
    );
    yield r'amountRupiah';
    yield serializers.serialize(
      object.amountRupiah,
      specifiedType: const FullType(int),
    );
    yield r'createdAt';
    yield serializers.serialize(
      object.createdAt,
      specifiedType: const FullType(DateTime),
    );
    yield r'reviewNote';
    yield serializers.serialize(
      object.reviewNote,
      specifiedType: const FullType(String),
    );
    yield r'proofObjectPath';
    yield serializers.serialize(
      object.proofObjectPath,
      specifiedType: const FullType(String),
    );
    yield r'paymentReferenceNote';
    yield serializers.serialize(
      object.paymentReferenceNote,
      specifiedType: const FullType(String),
    );
    yield r'userEmail';
    yield serializers.serialize(
      object.userEmail,
      specifiedType: const FullType(String),
    );
    yield r'id';
    yield serializers.serialize(
      object.id,
      specifiedType: const FullType(int),
    );
    yield r'reviewedByUserId';
    yield serializers.serialize(
      object.reviewedByUserId,
      specifiedType: const FullType(int),
    );
    yield r'status';
    yield serializers.serialize(
      object.status,
      specifiedType: const FullType(TopupRequestStatus),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    TopupRequestWithUser object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required TopupRequestWithUserBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'creditsGranted':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(int),
          ) as int;
          result.creditsGranted = valueDes;
          break;
        case r'creditsRequested':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(int),
          ) as int;
          result.creditsRequested = valueDes;
          break;
        case r'reviewedAt':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(DateTime),
          ) as DateTime;
          result.reviewedAt = valueDes;
          break;
        case r'userDisplayName':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.userDisplayName = valueDes;
          break;
        case r'userId':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(int),
          ) as int;
          result.userId = valueDes;
          break;
        case r'conversionRateSnapshot':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(int),
          ) as int;
          result.conversionRateSnapshot = valueDes;
          break;
        case r'amountRupiah':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(int),
          ) as int;
          result.amountRupiah = valueDes;
          break;
        case r'createdAt':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(DateTime),
          ) as DateTime;
          result.createdAt = valueDes;
          break;
        case r'reviewNote':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.reviewNote = valueDes;
          break;
        case r'proofObjectPath':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.proofObjectPath = valueDes;
          break;
        case r'paymentReferenceNote':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.paymentReferenceNote = valueDes;
          break;
        case r'userEmail':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.userEmail = valueDes;
          break;
        case r'id':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(int),
          ) as int;
          result.id = valueDes;
          break;
        case r'reviewedByUserId':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(int),
          ) as int;
          result.reviewedByUserId = valueDes;
          break;
        case r'status':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(TopupRequestStatus),
          ) as TopupRequestStatus;
          result.status = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  TopupRequestWithUser deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = TopupRequestWithUserBuilder();
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

