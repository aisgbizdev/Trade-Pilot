//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'update_user_quota_body.g.dart';

/// UpdateUserQuotaBody
///
/// Properties:
/// * [customQuotaPerHour] - Positive integer to set an override, or null to clear it.
/// * [customQuotaPerDay] - Positive integer to set an override, or null to clear it.
@BuiltValue()
abstract class UpdateUserQuotaBody implements Built<UpdateUserQuotaBody, UpdateUserQuotaBodyBuilder> {
  /// Positive integer to set an override, or null to clear it.
  @BuiltValueField(wireName: r'customQuotaPerHour')
  int get customQuotaPerHour;

  /// Positive integer to set an override, or null to clear it.
  @BuiltValueField(wireName: r'customQuotaPerDay')
  int get customQuotaPerDay;

  UpdateUserQuotaBody._();

  factory UpdateUserQuotaBody([void updates(UpdateUserQuotaBodyBuilder b)]) = _$UpdateUserQuotaBody;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(UpdateUserQuotaBodyBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<UpdateUserQuotaBody> get serializer => _$UpdateUserQuotaBodySerializer();
}

class _$UpdateUserQuotaBodySerializer implements PrimitiveSerializer<UpdateUserQuotaBody> {
  @override
  final Iterable<Type> types = const [UpdateUserQuotaBody, _$UpdateUserQuotaBody];

  @override
  final String wireName = r'UpdateUserQuotaBody';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    UpdateUserQuotaBody object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'customQuotaPerHour';
    yield serializers.serialize(
      object.customQuotaPerHour,
      specifiedType: const FullType(int),
    );
    yield r'customQuotaPerDay';
    yield serializers.serialize(
      object.customQuotaPerDay,
      specifiedType: const FullType(int),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    UpdateUserQuotaBody object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required UpdateUserQuotaBodyBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'customQuotaPerHour':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(int),
          ) as int;
          result.customQuotaPerHour = valueDes;
          break;
        case r'customQuotaPerDay':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(int),
          ) as int;
          result.customQuotaPerDay = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  UpdateUserQuotaBody deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = UpdateUserQuotaBodyBuilder();
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

