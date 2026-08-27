//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_collection/built_collection.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'fundamental_news_source.g.dart';

/// FundamentalNewsSource
///
/// Properties:
/// * [id] 
/// * [label] 
/// * [tier] 
/// * [configured] 
/// * [available] 
@BuiltValue()
abstract class FundamentalNewsSource implements Built<FundamentalNewsSource, FundamentalNewsSourceBuilder> {
  @BuiltValueField(wireName: r'id')
  String get id;

  @BuiltValueField(wireName: r'label')
  String get label;

  @BuiltValueField(wireName: r'tier')
  FundamentalNewsSourceTierEnum get tier;
  // enum tierEnum {  primary,  standard,  licensed,  };

  @BuiltValueField(wireName: r'configured')
  bool get configured;

  @BuiltValueField(wireName: r'available')
  bool get available;

  FundamentalNewsSource._();

  factory FundamentalNewsSource([void updates(FundamentalNewsSourceBuilder b)]) = _$FundamentalNewsSource;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(FundamentalNewsSourceBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<FundamentalNewsSource> get serializer => _$FundamentalNewsSourceSerializer();
}

class _$FundamentalNewsSourceSerializer implements PrimitiveSerializer<FundamentalNewsSource> {
  @override
  final Iterable<Type> types = const [FundamentalNewsSource, _$FundamentalNewsSource];

  @override
  final String wireName = r'FundamentalNewsSource';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    FundamentalNewsSource object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'id';
    yield serializers.serialize(
      object.id,
      specifiedType: const FullType(String),
    );
    yield r'label';
    yield serializers.serialize(
      object.label,
      specifiedType: const FullType(String),
    );
    yield r'tier';
    yield serializers.serialize(
      object.tier,
      specifiedType: const FullType(FundamentalNewsSourceTierEnum),
    );
    yield r'configured';
    yield serializers.serialize(
      object.configured,
      specifiedType: const FullType(bool),
    );
    yield r'available';
    yield serializers.serialize(
      object.available,
      specifiedType: const FullType(bool),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    FundamentalNewsSource object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required FundamentalNewsSourceBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'id':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.id = valueDes;
          break;
        case r'label':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.label = valueDes;
          break;
        case r'tier':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(FundamentalNewsSourceTierEnum),
          ) as FundamentalNewsSourceTierEnum;
          result.tier = valueDes;
          break;
        case r'configured':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(bool),
          ) as bool;
          result.configured = valueDes;
          break;
        case r'available':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(bool),
          ) as bool;
          result.available = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  FundamentalNewsSource deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = FundamentalNewsSourceBuilder();
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

class FundamentalNewsSourceTierEnum extends EnumClass {

  @BuiltValueEnumConst(wireName: r'primary')
  static const FundamentalNewsSourceTierEnum primary = _$fundamentalNewsSourceTierEnum_primary;
  @BuiltValueEnumConst(wireName: r'standard')
  static const FundamentalNewsSourceTierEnum standard = _$fundamentalNewsSourceTierEnum_standard;
  @BuiltValueEnumConst(wireName: r'licensed')
  static const FundamentalNewsSourceTierEnum licensed = _$fundamentalNewsSourceTierEnum_licensed;

  static Serializer<FundamentalNewsSourceTierEnum> get serializer => _$fundamentalNewsSourceTierEnumSerializer;

  const FundamentalNewsSourceTierEnum._(String name): super(name);

  static BuiltSet<FundamentalNewsSourceTierEnum> get values => _$fundamentalNewsSourceTierEnumValues;
  static FundamentalNewsSourceTierEnum valueOf(String name) => _$fundamentalNewsSourceTierEnumValueOf(name);
}

