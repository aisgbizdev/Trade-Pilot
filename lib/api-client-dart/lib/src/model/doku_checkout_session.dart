//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'doku_checkout_session.g.dart';

/// DokuCheckoutSession
///
/// Properties:
/// * [id] - The credit_topup_requests row id (poll via GET /topups/doku/{id}/status).
/// * [paymentUrl] - DOKU's hosted checkout page — redirect the browser here.
/// * [expiresAt] 
@BuiltValue()
abstract class DokuCheckoutSession implements Built<DokuCheckoutSession, DokuCheckoutSessionBuilder> {
  /// The credit_topup_requests row id (poll via GET /topups/doku/{id}/status).
  @BuiltValueField(wireName: r'id')
  int get id;

  /// DOKU's hosted checkout page — redirect the browser here.
  @BuiltValueField(wireName: r'paymentUrl')
  String get paymentUrl;

  @BuiltValueField(wireName: r'expiresAt')
  DateTime get expiresAt;

  DokuCheckoutSession._();

  factory DokuCheckoutSession([void updates(DokuCheckoutSessionBuilder b)]) = _$DokuCheckoutSession;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(DokuCheckoutSessionBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<DokuCheckoutSession> get serializer => _$DokuCheckoutSessionSerializer();
}

class _$DokuCheckoutSessionSerializer implements PrimitiveSerializer<DokuCheckoutSession> {
  @override
  final Iterable<Type> types = const [DokuCheckoutSession, _$DokuCheckoutSession];

  @override
  final String wireName = r'DokuCheckoutSession';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    DokuCheckoutSession object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'id';
    yield serializers.serialize(
      object.id,
      specifiedType: const FullType(int),
    );
    yield r'paymentUrl';
    yield serializers.serialize(
      object.paymentUrl,
      specifiedType: const FullType(String),
    );
    yield r'expiresAt';
    yield serializers.serialize(
      object.expiresAt,
      specifiedType: const FullType(DateTime),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    DokuCheckoutSession object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required DokuCheckoutSessionBuilder result,
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
        case r'paymentUrl':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.paymentUrl = valueDes;
          break;
        case r'expiresAt':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(DateTime),
          ) as DateTime;
          result.expiresAt = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  DokuCheckoutSession deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = DokuCheckoutSessionBuilder();
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

