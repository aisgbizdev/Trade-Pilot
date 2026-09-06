//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'push_unsubscribe_body.g.dart';

/// PushUnsubscribeBody
///
/// Properties:
/// * [endpoint] 
@BuiltValue()
abstract class PushUnsubscribeBody implements Built<PushUnsubscribeBody, PushUnsubscribeBodyBuilder> {
  @BuiltValueField(wireName: r'endpoint')
  String get endpoint;

  PushUnsubscribeBody._();

  factory PushUnsubscribeBody([void updates(PushUnsubscribeBodyBuilder b)]) = _$PushUnsubscribeBody;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(PushUnsubscribeBodyBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<PushUnsubscribeBody> get serializer => _$PushUnsubscribeBodySerializer();
}

class _$PushUnsubscribeBodySerializer implements PrimitiveSerializer<PushUnsubscribeBody> {
  @override
  final Iterable<Type> types = const [PushUnsubscribeBody, _$PushUnsubscribeBody];

  @override
  final String wireName = r'PushUnsubscribeBody';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    PushUnsubscribeBody object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'endpoint';
    yield serializers.serialize(
      object.endpoint,
      specifiedType: const FullType(String),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    PushUnsubscribeBody object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required PushUnsubscribeBodyBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'endpoint':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.endpoint = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  PushUnsubscribeBody deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = PushUnsubscribeBodyBuilder();
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

