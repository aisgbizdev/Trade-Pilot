//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:trade_pilot_api_client/src/model/push_subscription_keys.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'push_subscription_body.g.dart';

/// PushSubscriptionBody
///
/// Properties:
/// * [endpoint] 
/// * [keys] 
@BuiltValue()
abstract class PushSubscriptionBody implements Built<PushSubscriptionBody, PushSubscriptionBodyBuilder> {
  @BuiltValueField(wireName: r'endpoint')
  String get endpoint;

  @BuiltValueField(wireName: r'keys')
  PushSubscriptionKeys get keys;

  PushSubscriptionBody._();

  factory PushSubscriptionBody([void updates(PushSubscriptionBodyBuilder b)]) = _$PushSubscriptionBody;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(PushSubscriptionBodyBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<PushSubscriptionBody> get serializer => _$PushSubscriptionBodySerializer();
}

class _$PushSubscriptionBodySerializer implements PrimitiveSerializer<PushSubscriptionBody> {
  @override
  final Iterable<Type> types = const [PushSubscriptionBody, _$PushSubscriptionBody];

  @override
  final String wireName = r'PushSubscriptionBody';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    PushSubscriptionBody object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'endpoint';
    yield serializers.serialize(
      object.endpoint,
      specifiedType: const FullType(String),
    );
    yield r'keys';
    yield serializers.serialize(
      object.keys,
      specifiedType: const FullType(PushSubscriptionKeys),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    PushSubscriptionBody object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required PushSubscriptionBodyBuilder result,
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
        case r'keys':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(PushSubscriptionKeys),
          ) as PushSubscriptionKeys;
          result.keys.replace(valueDes);
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  PushSubscriptionBody deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = PushSubscriptionBodyBuilder();
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

