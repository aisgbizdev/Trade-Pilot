//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'create_doku_checkout_body.g.dart';

/// CreateDokuCheckoutBody
///
/// Properties:
/// * [amountRupiah] - Must match one of the fixed packages at/above the DOKU-only threshold.
@BuiltValue()
abstract class CreateDokuCheckoutBody implements Built<CreateDokuCheckoutBody, CreateDokuCheckoutBodyBuilder> {
  /// Must match one of the fixed packages at/above the DOKU-only threshold.
  @BuiltValueField(wireName: r'amountRupiah')
  int get amountRupiah;

  CreateDokuCheckoutBody._();

  factory CreateDokuCheckoutBody([void updates(CreateDokuCheckoutBodyBuilder b)]) = _$CreateDokuCheckoutBody;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(CreateDokuCheckoutBodyBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<CreateDokuCheckoutBody> get serializer => _$CreateDokuCheckoutBodySerializer();
}

class _$CreateDokuCheckoutBodySerializer implements PrimitiveSerializer<CreateDokuCheckoutBody> {
  @override
  final Iterable<Type> types = const [CreateDokuCheckoutBody, _$CreateDokuCheckoutBody];

  @override
  final String wireName = r'CreateDokuCheckoutBody';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    CreateDokuCheckoutBody object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'amountRupiah';
    yield serializers.serialize(
      object.amountRupiah,
      specifiedType: const FullType(int),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    CreateDokuCheckoutBody object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required CreateDokuCheckoutBodyBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'amountRupiah':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(int),
          ) as int;
          result.amountRupiah = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  CreateDokuCheckoutBody deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = CreateDokuCheckoutBodyBuilder();
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

