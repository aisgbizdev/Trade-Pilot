//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'broadcast_send_result.g.dart';

/// BroadcastSendResult
///
/// Properties:
/// * [broadcastId] 
/// * [recipientCount] 
/// * [message] 
@BuiltValue()
abstract class BroadcastSendResult implements Built<BroadcastSendResult, BroadcastSendResultBuilder> {
  @BuiltValueField(wireName: r'broadcastId')
  int get broadcastId;

  @BuiltValueField(wireName: r'recipientCount')
  int get recipientCount;

  @BuiltValueField(wireName: r'message')
  String get message;

  BroadcastSendResult._();

  factory BroadcastSendResult([void updates(BroadcastSendResultBuilder b)]) = _$BroadcastSendResult;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(BroadcastSendResultBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<BroadcastSendResult> get serializer => _$BroadcastSendResultSerializer();
}

class _$BroadcastSendResultSerializer implements PrimitiveSerializer<BroadcastSendResult> {
  @override
  final Iterable<Type> types = const [BroadcastSendResult, _$BroadcastSendResult];

  @override
  final String wireName = r'BroadcastSendResult';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    BroadcastSendResult object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'broadcastId';
    yield serializers.serialize(
      object.broadcastId,
      specifiedType: const FullType(int),
    );
    yield r'recipientCount';
    yield serializers.serialize(
      object.recipientCount,
      specifiedType: const FullType(int),
    );
    yield r'message';
    yield serializers.serialize(
      object.message,
      specifiedType: const FullType(String),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    BroadcastSendResult object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required BroadcastSendResultBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'broadcastId':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(int),
          ) as int;
          result.broadcastId = valueDes;
          break;
        case r'recipientCount':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(int),
          ) as int;
          result.recipientCount = valueDes;
          break;
        case r'message':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.message = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  BroadcastSendResult deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = BroadcastSendResultBuilder();
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

