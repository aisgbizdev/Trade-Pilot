//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'update_user_credit_body.g.dart';

/// UpdateUserCreditBody
///
/// Properties:
/// * [balance] - Target credit balance for this user (not a delta).
@BuiltValue()
abstract class UpdateUserCreditBody implements Built<UpdateUserCreditBody, UpdateUserCreditBodyBuilder> {
  /// Target credit balance for this user (not a delta).
  @BuiltValueField(wireName: r'balance')
  int get balance;

  UpdateUserCreditBody._();

  factory UpdateUserCreditBody([void updates(UpdateUserCreditBodyBuilder b)]) = _$UpdateUserCreditBody;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(UpdateUserCreditBodyBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<UpdateUserCreditBody> get serializer => _$UpdateUserCreditBodySerializer();
}

class _$UpdateUserCreditBodySerializer implements PrimitiveSerializer<UpdateUserCreditBody> {
  @override
  final Iterable<Type> types = const [UpdateUserCreditBody, _$UpdateUserCreditBody];

  @override
  final String wireName = r'UpdateUserCreditBody';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    UpdateUserCreditBody object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'balance';
    yield serializers.serialize(
      object.balance,
      specifiedType: const FullType(int),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    UpdateUserCreditBody object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required UpdateUserCreditBodyBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'balance':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(int),
          ) as int;
          result.balance = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  UpdateUserCreditBody deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = UpdateUserCreditBodyBuilder();
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

