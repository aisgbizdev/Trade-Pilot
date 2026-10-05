//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_collection/built_collection.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'create_doku_checkout_body.g.dart';

/// CreateDokuCheckoutBody
///
/// Properties:
/// * [amountRupiah] - Must match one of the fixed packages at/above the DOKU-only threshold.
/// * [method] - Which DOKU-hosted channel to restrict the checkout page to. \"va\" carries the flat admin fee on top of the package price; \"qris\" does not (DOKU's own QRIS cost isn't passed on to the customer).
/// * [source_] - Set when this checkout was started from the /topup?source=app page (reached via the mobile app's web-handoff). Embedded into DOKU's callbackUrl/callbackUrlCancel so the page can tell it should offer the id.tradepilot.app:// return deep link once payment resolves. Omitted entirely for an ordinary web visit.
@BuiltValue()
abstract class CreateDokuCheckoutBody implements Built<CreateDokuCheckoutBody, CreateDokuCheckoutBodyBuilder> {
  /// Must match one of the fixed packages at/above the DOKU-only threshold.
  @BuiltValueField(wireName: r'amountRupiah')
  int get amountRupiah;

  /// Which DOKU-hosted channel to restrict the checkout page to. \"va\" carries the flat admin fee on top of the package price; \"qris\" does not (DOKU's own QRIS cost isn't passed on to the customer).
  @BuiltValueField(wireName: r'method')
  CreateDokuCheckoutBodyMethodEnum get method;
  // enum methodEnum {  va,  qris,  };

  /// Set when this checkout was started from the /topup?source=app page (reached via the mobile app's web-handoff). Embedded into DOKU's callbackUrl/callbackUrlCancel so the page can tell it should offer the id.tradepilot.app:// return deep link once payment resolves. Omitted entirely for an ordinary web visit.
  @BuiltValueField(wireName: r'source')
  CreateDokuCheckoutBodySource_Enum? get source_;
  // enum source_Enum {  app,  };

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
    yield r'method';
    yield serializers.serialize(
      object.method,
      specifiedType: const FullType(CreateDokuCheckoutBodyMethodEnum),
    );
    if (object.source_ != null) {
      yield r'source';
      yield serializers.serialize(
        object.source_,
        specifiedType: const FullType(CreateDokuCheckoutBodySource_Enum),
      );
    }
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
        case r'method':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(CreateDokuCheckoutBodyMethodEnum),
          ) as CreateDokuCheckoutBodyMethodEnum;
          result.method = valueDes;
          break;
        case r'source':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(CreateDokuCheckoutBodySource_Enum),
          ) as CreateDokuCheckoutBodySource_Enum?;
          if (valueDes == null) continue;
          result.source_ = valueDes;
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

class CreateDokuCheckoutBodyMethodEnum extends EnumClass {

  /// Which DOKU-hosted channel to restrict the checkout page to. \"va\" carries the flat admin fee on top of the package price; \"qris\" does not (DOKU's own QRIS cost isn't passed on to the customer).
  @BuiltValueEnumConst(wireName: r'va')
  static const CreateDokuCheckoutBodyMethodEnum va = _$createDokuCheckoutBodyMethodEnum_va;
  /// Which DOKU-hosted channel to restrict the checkout page to. \"va\" carries the flat admin fee on top of the package price; \"qris\" does not (DOKU's own QRIS cost isn't passed on to the customer).
  @BuiltValueEnumConst(wireName: r'qris')
  static const CreateDokuCheckoutBodyMethodEnum qris = _$createDokuCheckoutBodyMethodEnum_qris;

  static Serializer<CreateDokuCheckoutBodyMethodEnum> get serializer => _$createDokuCheckoutBodyMethodEnumSerializer;

  const CreateDokuCheckoutBodyMethodEnum._(String name): super(name);

  static BuiltSet<CreateDokuCheckoutBodyMethodEnum> get values => _$createDokuCheckoutBodyMethodEnumValues;
  static CreateDokuCheckoutBodyMethodEnum valueOf(String name) => _$createDokuCheckoutBodyMethodEnumValueOf(name);
}

class CreateDokuCheckoutBodySource_Enum extends EnumClass {

  /// Set when this checkout was started from the /topup?source=app page (reached via the mobile app's web-handoff). Embedded into DOKU's callbackUrl/callbackUrlCancel so the page can tell it should offer the id.tradepilot.app:// return deep link once payment resolves. Omitted entirely for an ordinary web visit.
  @BuiltValueEnumConst(wireName: r'app')
  static const CreateDokuCheckoutBodySource_Enum app = _$createDokuCheckoutBodySourceEnum_app;

  static Serializer<CreateDokuCheckoutBodySource_Enum> get serializer => _$createDokuCheckoutBodySourceEnumSerializer;

  const CreateDokuCheckoutBodySource_Enum._(String name): super(name);

  static BuiltSet<CreateDokuCheckoutBodySource_Enum> get values => _$createDokuCheckoutBodySourceEnumValues;
  static CreateDokuCheckoutBodySource_Enum valueOf(String name) => _$createDokuCheckoutBodySourceEnumValueOf(name);
}

