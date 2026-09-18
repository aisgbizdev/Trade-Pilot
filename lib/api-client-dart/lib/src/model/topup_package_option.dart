//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'topup_package_option.g.dart';

/// One fixed top-up package (see lib/credits.ts) — bigger packages give a better effective per-credit rate.
///
/// Properties:
/// * [amountRupiah] 
/// * [credits] 
@BuiltValue()
abstract class TopupPackageOption implements Built<TopupPackageOption, TopupPackageOptionBuilder> {
  @BuiltValueField(wireName: r'amountRupiah')
  int get amountRupiah;

  @BuiltValueField(wireName: r'credits')
  int get credits;

  TopupPackageOption._();

  factory TopupPackageOption([void updates(TopupPackageOptionBuilder b)]) = _$TopupPackageOption;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(TopupPackageOptionBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<TopupPackageOption> get serializer => _$TopupPackageOptionSerializer();
}

class _$TopupPackageOptionSerializer implements PrimitiveSerializer<TopupPackageOption> {
  @override
  final Iterable<Type> types = const [TopupPackageOption, _$TopupPackageOption];

  @override
  final String wireName = r'TopupPackageOption';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    TopupPackageOption object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'amountRupiah';
    yield serializers.serialize(
      object.amountRupiah,
      specifiedType: const FullType(int),
    );
    yield r'credits';
    yield serializers.serialize(
      object.credits,
      specifiedType: const FullType(int),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    TopupPackageOption object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required TopupPackageOptionBuilder result,
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
        case r'credits':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(int),
          ) as int;
          result.credits = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  TopupPackageOption deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = TopupPackageOptionBuilder();
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

