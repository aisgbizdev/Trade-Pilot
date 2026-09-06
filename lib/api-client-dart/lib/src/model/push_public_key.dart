//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'push_public_key.g.dart';

/// PushPublicKey
///
/// Properties:
/// * [publicKey] 
@BuiltValue()
abstract class PushPublicKey implements Built<PushPublicKey, PushPublicKeyBuilder> {
  @BuiltValueField(wireName: r'publicKey')
  String get publicKey;

  PushPublicKey._();

  factory PushPublicKey([void updates(PushPublicKeyBuilder b)]) = _$PushPublicKey;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(PushPublicKeyBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<PushPublicKey> get serializer => _$PushPublicKeySerializer();
}

class _$PushPublicKeySerializer implements PrimitiveSerializer<PushPublicKey> {
  @override
  final Iterable<Type> types = const [PushPublicKey, _$PushPublicKey];

  @override
  final String wireName = r'PushPublicKey';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    PushPublicKey object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'publicKey';
    yield serializers.serialize(
      object.publicKey,
      specifiedType: const FullType(String),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    PushPublicKey object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required PushPublicKeyBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'publicKey':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.publicKey = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  PushPublicKey deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = PushPublicKeyBuilder();
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

