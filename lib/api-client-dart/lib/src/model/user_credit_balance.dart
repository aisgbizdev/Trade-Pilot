//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'user_credit_balance.g.dart';

/// UserCreditBalance
///
/// Properties:
/// * [id] 
/// * [creditBalance] 
@BuiltValue()
abstract class UserCreditBalance implements Built<UserCreditBalance, UserCreditBalanceBuilder> {
  @BuiltValueField(wireName: r'id')
  int get id;

  @BuiltValueField(wireName: r'creditBalance')
  int get creditBalance;

  UserCreditBalance._();

  factory UserCreditBalance([void updates(UserCreditBalanceBuilder b)]) = _$UserCreditBalance;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(UserCreditBalanceBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<UserCreditBalance> get serializer => _$UserCreditBalanceSerializer();
}

class _$UserCreditBalanceSerializer implements PrimitiveSerializer<UserCreditBalance> {
  @override
  final Iterable<Type> types = const [UserCreditBalance, _$UserCreditBalance];

  @override
  final String wireName = r'UserCreditBalance';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    UserCreditBalance object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'id';
    yield serializers.serialize(
      object.id,
      specifiedType: const FullType(int),
    );
    yield r'creditBalance';
    yield serializers.serialize(
      object.creditBalance,
      specifiedType: const FullType(int),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    UserCreditBalance object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required UserCreditBalanceBuilder result,
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
        case r'creditBalance':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(int),
          ) as int;
          result.creditBalance = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  UserCreditBalance deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = UserCreditBalanceBuilder();
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

