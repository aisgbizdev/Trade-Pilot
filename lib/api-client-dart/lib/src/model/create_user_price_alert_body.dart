//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_collection/built_collection.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'create_user_price_alert_body.g.dart';

/// CreateUserPriceAlertBody
///
/// Properties:
/// * [instrument] 
/// * [targetPrice] - Target price. Must be a positive finite number.
/// * [triggerDirection] 
/// * [note] 
/// * [lang] - UI language at create time; controls push notification language.
@BuiltValue()
abstract class CreateUserPriceAlertBody implements Built<CreateUserPriceAlertBody, CreateUserPriceAlertBodyBuilder> {
  @BuiltValueField(wireName: r'instrument')
  String get instrument;

  /// Target price. Must be a positive finite number.
  @BuiltValueField(wireName: r'targetPrice')
  num get targetPrice;

  @BuiltValueField(wireName: r'triggerDirection')
  CreateUserPriceAlertBodyTriggerDirectionEnum get triggerDirection;
  // enum triggerDirectionEnum {  above,  below,  };

  @BuiltValueField(wireName: r'note')
  String? get note;

  /// UI language at create time; controls push notification language.
  @BuiltValueField(wireName: r'lang')
  CreateUserPriceAlertBodyLangEnum? get lang;
  // enum langEnum {  en,  id,  };

  CreateUserPriceAlertBody._();

  factory CreateUserPriceAlertBody([void updates(CreateUserPriceAlertBodyBuilder b)]) = _$CreateUserPriceAlertBody;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(CreateUserPriceAlertBodyBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<CreateUserPriceAlertBody> get serializer => _$CreateUserPriceAlertBodySerializer();
}

class _$CreateUserPriceAlertBodySerializer implements PrimitiveSerializer<CreateUserPriceAlertBody> {
  @override
  final Iterable<Type> types = const [CreateUserPriceAlertBody, _$CreateUserPriceAlertBody];

  @override
  final String wireName = r'CreateUserPriceAlertBody';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    CreateUserPriceAlertBody object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'instrument';
    yield serializers.serialize(
      object.instrument,
      specifiedType: const FullType(String),
    );
    yield r'targetPrice';
    yield serializers.serialize(
      object.targetPrice,
      specifiedType: const FullType(num),
    );
    yield r'triggerDirection';
    yield serializers.serialize(
      object.triggerDirection,
      specifiedType: const FullType(CreateUserPriceAlertBodyTriggerDirectionEnum),
    );
    if (object.note != null) {
      yield r'note';
      yield serializers.serialize(
        object.note,
        specifiedType: const FullType(String),
      );
    }
    if (object.lang != null) {
      yield r'lang';
      yield serializers.serialize(
        object.lang,
        specifiedType: const FullType(CreateUserPriceAlertBodyLangEnum),
      );
    }
  }

  @override
  Object serialize(
    Serializers serializers,
    CreateUserPriceAlertBody object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required CreateUserPriceAlertBodyBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
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
            specifiedType: const FullType(num),
          ) as num;
          result.targetPrice = valueDes;
          break;
        case r'triggerDirection':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(CreateUserPriceAlertBodyTriggerDirectionEnum),
          ) as CreateUserPriceAlertBodyTriggerDirectionEnum;
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
        case r'lang':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(CreateUserPriceAlertBodyLangEnum),
          ) as CreateUserPriceAlertBodyLangEnum?;
          if (valueDes == null) continue;
          result.lang = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  CreateUserPriceAlertBody deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = CreateUserPriceAlertBodyBuilder();
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

class CreateUserPriceAlertBodyTriggerDirectionEnum extends EnumClass {

  @BuiltValueEnumConst(wireName: r'above')
  static const CreateUserPriceAlertBodyTriggerDirectionEnum above = _$createUserPriceAlertBodyTriggerDirectionEnum_above;
  @BuiltValueEnumConst(wireName: r'below')
  static const CreateUserPriceAlertBodyTriggerDirectionEnum below = _$createUserPriceAlertBodyTriggerDirectionEnum_below;

  static Serializer<CreateUserPriceAlertBodyTriggerDirectionEnum> get serializer => _$createUserPriceAlertBodyTriggerDirectionEnumSerializer;

  const CreateUserPriceAlertBodyTriggerDirectionEnum._(String name): super(name);

  static BuiltSet<CreateUserPriceAlertBodyTriggerDirectionEnum> get values => _$createUserPriceAlertBodyTriggerDirectionEnumValues;
  static CreateUserPriceAlertBodyTriggerDirectionEnum valueOf(String name) => _$createUserPriceAlertBodyTriggerDirectionEnumValueOf(name);
}

class CreateUserPriceAlertBodyLangEnum extends EnumClass {

  /// UI language at create time; controls push notification language.
  @BuiltValueEnumConst(wireName: r'en')
  static const CreateUserPriceAlertBodyLangEnum en = _$createUserPriceAlertBodyLangEnum_en;
  /// UI language at create time; controls push notification language.
  @BuiltValueEnumConst(wireName: r'id')
  static const CreateUserPriceAlertBodyLangEnum id = _$createUserPriceAlertBodyLangEnum_id;

  static Serializer<CreateUserPriceAlertBodyLangEnum> get serializer => _$createUserPriceAlertBodyLangEnumSerializer;

  const CreateUserPriceAlertBodyLangEnum._(String name): super(name);

  static BuiltSet<CreateUserPriceAlertBodyLangEnum> get values => _$createUserPriceAlertBodyLangEnumValues;
  static CreateUserPriceAlertBodyLangEnum valueOf(String name) => _$createUserPriceAlertBodyLangEnumValueOf(name);
}

