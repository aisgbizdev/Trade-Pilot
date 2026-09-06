//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_collection/built_collection.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'user_price_alert.g.dart';

/// UserPriceAlert
///
/// Properties:
/// * [id] 
/// * [instrument] 
/// * [targetPrice] - Target price as a string, preserving the precision the user typed.
/// * [triggerDirection] 
/// * [note] 
/// * [status] 
/// * [triggeredAt] 
/// * [triggeredPrice] 
/// * [createdAt] 
@BuiltValue()
abstract class UserPriceAlert implements Built<UserPriceAlert, UserPriceAlertBuilder> {
  @BuiltValueField(wireName: r'id')
  int get id;

  @BuiltValueField(wireName: r'instrument')
  String get instrument;

  /// Target price as a string, preserving the precision the user typed.
  @BuiltValueField(wireName: r'targetPrice')
  String get targetPrice;

  @BuiltValueField(wireName: r'triggerDirection')
  UserPriceAlertTriggerDirectionEnum get triggerDirection;
  // enum triggerDirectionEnum {  above,  below,  };

  @BuiltValueField(wireName: r'note')
  String? get note;

  @BuiltValueField(wireName: r'status')
  UserPriceAlertStatusEnum get status;
  // enum statusEnum {  active,  triggered,  cancelled,  };

  @BuiltValueField(wireName: r'triggeredAt')
  DateTime? get triggeredAt;

  @BuiltValueField(wireName: r'triggeredPrice')
  String? get triggeredPrice;

  @BuiltValueField(wireName: r'createdAt')
  DateTime get createdAt;

  UserPriceAlert._();

  factory UserPriceAlert([void updates(UserPriceAlertBuilder b)]) = _$UserPriceAlert;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(UserPriceAlertBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<UserPriceAlert> get serializer => _$UserPriceAlertSerializer();
}

class _$UserPriceAlertSerializer implements PrimitiveSerializer<UserPriceAlert> {
  @override
  final Iterable<Type> types = const [UserPriceAlert, _$UserPriceAlert];

  @override
  final String wireName = r'UserPriceAlert';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    UserPriceAlert object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'id';
    yield serializers.serialize(
      object.id,
      specifiedType: const FullType(int),
    );
    yield r'instrument';
    yield serializers.serialize(
      object.instrument,
      specifiedType: const FullType(String),
    );
    yield r'targetPrice';
    yield serializers.serialize(
      object.targetPrice,
      specifiedType: const FullType(String),
    );
    yield r'triggerDirection';
    yield serializers.serialize(
      object.triggerDirection,
      specifiedType: const FullType(UserPriceAlertTriggerDirectionEnum),
    );
    if (object.note != null) {
      yield r'note';
      yield serializers.serialize(
        object.note,
        specifiedType: const FullType(String),
      );
    }
    yield r'status';
    yield serializers.serialize(
      object.status,
      specifiedType: const FullType(UserPriceAlertStatusEnum),
    );
    if (object.triggeredAt != null) {
      yield r'triggeredAt';
      yield serializers.serialize(
        object.triggeredAt,
        specifiedType: const FullType(DateTime),
      );
    }
    if (object.triggeredPrice != null) {
      yield r'triggeredPrice';
      yield serializers.serialize(
        object.triggeredPrice,
        specifiedType: const FullType(String),
      );
    }
    yield r'createdAt';
    yield serializers.serialize(
      object.createdAt,
      specifiedType: const FullType(DateTime),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    UserPriceAlert object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required UserPriceAlertBuilder result,
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
        case r'instrument':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.instrument = valueDes;
          break;
        case r'targetPrice':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.targetPrice = valueDes;
          break;
        case r'triggerDirection':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(UserPriceAlertTriggerDirectionEnum),
          ) as UserPriceAlertTriggerDirectionEnum;
          result.triggerDirection = valueDes;
          break;
        case r'note':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.note = valueDes;
          break;
        case r'status':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(UserPriceAlertStatusEnum),
          ) as UserPriceAlertStatusEnum;
          result.status = valueDes;
          break;
        case r'triggeredAt':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(DateTime),
          ) as DateTime?;
          if (valueDes == null) continue;
          result.triggeredAt = valueDes;
          break;
        case r'triggeredPrice':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.triggeredPrice = valueDes;
          break;
        case r'createdAt':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(DateTime),
          ) as DateTime;
          result.createdAt = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  UserPriceAlert deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = UserPriceAlertBuilder();
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

class UserPriceAlertTriggerDirectionEnum extends EnumClass {

  @BuiltValueEnumConst(wireName: r'above')
  static const UserPriceAlertTriggerDirectionEnum above = _$userPriceAlertTriggerDirectionEnum_above;
  @BuiltValueEnumConst(wireName: r'below')
  static const UserPriceAlertTriggerDirectionEnum below = _$userPriceAlertTriggerDirectionEnum_below;

  static Serializer<UserPriceAlertTriggerDirectionEnum> get serializer => _$userPriceAlertTriggerDirectionEnumSerializer;

  const UserPriceAlertTriggerDirectionEnum._(String name): super(name);

  static BuiltSet<UserPriceAlertTriggerDirectionEnum> get values => _$userPriceAlertTriggerDirectionEnumValues;
  static UserPriceAlertTriggerDirectionEnum valueOf(String name) => _$userPriceAlertTriggerDirectionEnumValueOf(name);
}

class UserPriceAlertStatusEnum extends EnumClass {

  @BuiltValueEnumConst(wireName: r'active')
  static const UserPriceAlertStatusEnum active = _$userPriceAlertStatusEnum_active;
  @BuiltValueEnumConst(wireName: r'triggered')
  static const UserPriceAlertStatusEnum triggered = _$userPriceAlertStatusEnum_triggered;
  @BuiltValueEnumConst(wireName: r'cancelled')
  static const UserPriceAlertStatusEnum cancelled = _$userPriceAlertStatusEnum_cancelled;

  static Serializer<UserPriceAlertStatusEnum> get serializer => _$userPriceAlertStatusEnumSerializer;

  const UserPriceAlertStatusEnum._(String name): super(name);

  static BuiltSet<UserPriceAlertStatusEnum> get values => _$userPriceAlertStatusEnumValues;
  static UserPriceAlertStatusEnum valueOf(String name) => _$userPriceAlertStatusEnumValueOf(name);
}

