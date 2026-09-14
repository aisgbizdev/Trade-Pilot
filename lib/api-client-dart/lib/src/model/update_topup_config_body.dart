//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'update_topup_config_body.g.dart';

/// UpdateTopupConfigBody
///
/// Properties:
/// * [rupiahPerCredit] 
@BuiltValue()
abstract class UpdateTopupConfigBody implements Built<UpdateTopupConfigBody, UpdateTopupConfigBodyBuilder> {
  @BuiltValueField(wireName: r'rupiahPerCredit')
  int get rupiahPerCredit;

  UpdateTopupConfigBody._();

  factory UpdateTopupConfigBody([void updates(UpdateTopupConfigBodyBuilder b)]) = _$UpdateTopupConfigBody;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(UpdateTopupConfigBodyBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<UpdateTopupConfigBody> get serializer => _$UpdateTopupConfigBodySerializer();
}

class _$UpdateTopupConfigBodySerializer implements PrimitiveSerializer<UpdateTopupConfigBody> {
  @override
  final Iterable<Type> types = const [UpdateTopupConfigBody, _$UpdateTopupConfigBody];

  @override
  final String wireName = r'UpdateTopupConfigBody';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    UpdateTopupConfigBody object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'rupiahPerCredit';
    yield serializers.serialize(
      object.rupiahPerCredit,
      specifiedType: const FullType(int),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    UpdateTopupConfigBody object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required UpdateTopupConfigBodyBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'rupiahPerCredit':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(int),
          ) as int;
          result.rupiahPerCredit = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  UpdateTopupConfigBody deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = UpdateTopupConfigBodyBuilder();
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

