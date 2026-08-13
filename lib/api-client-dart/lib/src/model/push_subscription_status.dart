//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'push_subscription_status.g.dart';

/// PushSubscriptionStatus
///
/// Properties:
/// * [subscribed] 
@BuiltValue()
abstract class PushSubscriptionStatus implements Built<PushSubscriptionStatus, PushSubscriptionStatusBuilder> {
  @BuiltValueField(wireName: r'subscribed')
  bool get subscribed;

  PushSubscriptionStatus._();

  factory PushSubscriptionStatus([void updates(PushSubscriptionStatusBuilder b)]) = _$PushSubscriptionStatus;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(PushSubscriptionStatusBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<PushSubscriptionStatus> get serializer => _$PushSubscriptionStatusSerializer();
}

class _$PushSubscriptionStatusSerializer implements PrimitiveSerializer<PushSubscriptionStatus> {
  @override
  final Iterable<Type> types = const [PushSubscriptionStatus, _$PushSubscriptionStatus];

  @override
  final String wireName = r'PushSubscriptionStatus';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    PushSubscriptionStatus object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'subscribed';
    yield serializers.serialize(
      object.subscribed,
      specifiedType: const FullType(bool),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    PushSubscriptionStatus object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required PushSubscriptionStatusBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'subscribed':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(bool),
          ) as bool;
          result.subscribed = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  PushSubscriptionStatus deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = PushSubscriptionStatusBuilder();
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

