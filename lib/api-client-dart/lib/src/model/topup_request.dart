//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:trade_pilot_api_client/src/model/topup_request_status.dart';
import 'package:built_collection/built_collection.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'topup_request.g.dart';

/// TopupRequest
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
/// * [paymentProvider] 
/// * [dokuPaymentUrl] - The DOKU hosted checkout page URL — present only while a \"doku\" request is still \"pending\" (lets the frontend offer a \"resume payment\" link); null otherwise.
@BuiltValue(instantiable: false)
abstract class TopupRequest  {
  @BuiltValueField(wireName: r'id')
  int get id;

  @BuiltValueField(wireName: r'userId')
  int get userId;

  @BuiltValueField(wireName: r'amountRupiah')
  int get amountRupiah;

  @BuiltValueField(wireName: r'creditsRequested')
  int get creditsRequested;

  @BuiltValueField(wireName: r'conversionRateSnapshot')
  int get conversionRateSnapshot;

  @BuiltValueField(wireName: r'paymentReferenceNote')
  String get paymentReferenceNote;

  @BuiltValueField(wireName: r'proofObjectPath')
  String get proofObjectPath;

  @BuiltValueField(wireName: r'status')
  TopupRequestStatus get status;
  // enum statusEnum {  pending,  approved,  rejected,  };

  @BuiltValueField(wireName: r'reviewedByUserId')
  int get reviewedByUserId;

  @BuiltValueField(wireName: r'reviewedAt')
  DateTime get reviewedAt;

  @BuiltValueField(wireName: r'reviewNote')
  String get reviewNote;

  @BuiltValueField(wireName: r'creditsGranted')
  int get creditsGranted;

  @BuiltValueField(wireName: r'createdAt')
  DateTime get createdAt;

  @BuiltValueField(wireName: r'paymentProvider')
  TopupRequestPaymentProviderEnum get paymentProvider;
  // enum paymentProviderEnum {  manual,  doku,  };

  /// The DOKU hosted checkout page URL — present only while a \"doku\" request is still \"pending\" (lets the frontend offer a \"resume payment\" link); null otherwise.
  @BuiltValueField(wireName: r'dokuPaymentUrl')
  String get dokuPaymentUrl;

  @BuiltValueSerializer(custom: true)
  static Serializer<TopupRequest> get serializer => _$TopupRequestSerializer();
}

class _$TopupRequestSerializer implements PrimitiveSerializer<TopupRequest> {
  @override
  final Iterable<Type> types = const [TopupRequest];

  @override
  final String wireName = r'TopupRequest';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    TopupRequest object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'id';
    yield serializers.serialize(
      object.id,
      specifiedType: const FullType(int),
    );
    yield r'userId';
    yield serializers.serialize(
      object.userId,
      specifiedType: const FullType(int),
    );
    yield r'amountRupiah';
    yield serializers.serialize(
      object.amountRupiah,
      specifiedType: const FullType(int),
    );
    yield r'creditsRequested';
    yield serializers.serialize(
      object.creditsRequested,
      specifiedType: const FullType(int),
    );
    yield r'conversionRateSnapshot';
    yield serializers.serialize(
      object.conversionRateSnapshot,
      specifiedType: const FullType(int),
    );
    yield r'paymentReferenceNote';
    yield serializers.serialize(
      object.paymentReferenceNote,
      specifiedType: const FullType(String),
    );
    yield r'proofObjectPath';
    yield serializers.serialize(
      object.proofObjectPath,
      specifiedType: const FullType(String),
    );
    yield r'status';
    yield serializers.serialize(
      object.status,
      specifiedType: const FullType(TopupRequestStatus),
    );
    yield r'reviewedByUserId';
    yield serializers.serialize(
      object.reviewedByUserId,
      specifiedType: const FullType(int),
    );
    yield r'reviewedAt';
    yield serializers.serialize(
      object.reviewedAt,
      specifiedType: const FullType(DateTime),
    );
    yield r'reviewNote';
    yield serializers.serialize(
      object.reviewNote,
      specifiedType: const FullType(String),
    );
    yield r'creditsGranted';
    yield serializers.serialize(
      object.creditsGranted,
      specifiedType: const FullType(int),
    );
    yield r'createdAt';
    yield serializers.serialize(
      object.createdAt,
      specifiedType: const FullType(DateTime),
    );
    yield r'paymentProvider';
    yield serializers.serialize(
      object.paymentProvider,
      specifiedType: const FullType(TopupRequestPaymentProviderEnum),
    );
    yield r'dokuPaymentUrl';
    yield serializers.serialize(
      object.dokuPaymentUrl,
      specifiedType: const FullType(String),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    TopupRequest object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  @override
  TopupRequest deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return serializers.deserialize(serialized, specifiedType: FullType($TopupRequest)) as $TopupRequest;
  }
}

/// a concrete implementation of [TopupRequest], since [TopupRequest] is not instantiable
@BuiltValue(instantiable: true)
abstract class $TopupRequest implements TopupRequest, Built<$TopupRequest, $TopupRequestBuilder> {
  $TopupRequest._();

  factory $TopupRequest([void Function($TopupRequestBuilder)? updates]) = _$$TopupRequest;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults($TopupRequestBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<$TopupRequest> get serializer => _$$TopupRequestSerializer();
}

class _$$TopupRequestSerializer implements PrimitiveSerializer<$TopupRequest> {
  @override
  final Iterable<Type> types = const [$TopupRequest, _$$TopupRequest];

  @override
  final String wireName = r'$TopupRequest';

  @override
  Object serialize(
    Serializers serializers,
    $TopupRequest object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return serializers.serialize(object, specifiedType: FullType(TopupRequest))!;
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required TopupRequestBuilder result,
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
        case r'userId':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(int),
          ) as int;
          result.userId = valueDes;
          break;
        case r'amountRupiah':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(int),
          ) as int;
          result.amountRupiah = valueDes;
          break;
        case r'creditsRequested':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(int),
          ) as int;
          result.creditsRequested = valueDes;
          break;
        case r'conversionRateSnapshot':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(int),
          ) as int;
          result.conversionRateSnapshot = valueDes;
          break;
        case r'paymentReferenceNote':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.paymentReferenceNote = valueDes;
          break;
        case r'proofObjectPath':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.proofObjectPath = valueDes;
          break;
        case r'status':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(TopupRequestStatus),
          ) as TopupRequestStatus;
          result.status = valueDes;
          break;
        case r'reviewedByUserId':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(int),
          ) as int;
          result.reviewedByUserId = valueDes;
          break;
        case r'reviewedAt':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(DateTime),
          ) as DateTime;
          result.reviewedAt = valueDes;
          break;
        case r'reviewNote':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.reviewNote = valueDes;
          break;
        case r'creditsGranted':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(int),
          ) as int;
          result.creditsGranted = valueDes;
          break;
        case r'createdAt':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(DateTime),
          ) as DateTime;
          result.createdAt = valueDes;
          break;
        case r'paymentProvider':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(TopupRequestPaymentProviderEnum),
          ) as TopupRequestPaymentProviderEnum;
          result.paymentProvider = valueDes;
          break;
        case r'dokuPaymentUrl':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.dokuPaymentUrl = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  $TopupRequest deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = $TopupRequestBuilder();
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

class TopupRequestPaymentProviderEnum extends EnumClass {

  @BuiltValueEnumConst(wireName: r'manual')
  static const TopupRequestPaymentProviderEnum manual = _$topupRequestPaymentProviderEnum_manual;
  @BuiltValueEnumConst(wireName: r'doku')
  static const TopupRequestPaymentProviderEnum doku = _$topupRequestPaymentProviderEnum_doku;

  static Serializer<TopupRequestPaymentProviderEnum> get serializer => _$topupRequestPaymentProviderEnumSerializer;

  const TopupRequestPaymentProviderEnum._(String name): super(name);

  static BuiltSet<TopupRequestPaymentProviderEnum> get values => _$topupRequestPaymentProviderEnumValues;
  static TopupRequestPaymentProviderEnum valueOf(String name) => _$topupRequestPaymentProviderEnumValueOf(name);
}

