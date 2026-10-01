//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'web_handoff_body.g.dart';

/// WebHandoffBody
///
/// Properties:
/// * [next] - Relative path to land on after the browser session is established. Must match an exact-match allowlist server-side (currently only \"/topup\") — any other value, a full URL, or a protocol-relative \"//host\" is rejected with 400.
@BuiltValue()
abstract class WebHandoffBody implements Built<WebHandoffBody, WebHandoffBodyBuilder> {
  /// Relative path to land on after the browser session is established. Must match an exact-match allowlist server-side (currently only \"/topup\") — any other value, a full URL, or a protocol-relative \"//host\" is rejected with 400.
  @BuiltValueField(wireName: r'next')
  String get next;

  WebHandoffBody._();

  factory WebHandoffBody([void updates(WebHandoffBodyBuilder b)]) = _$WebHandoffBody;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(WebHandoffBodyBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<WebHandoffBody> get serializer => _$WebHandoffBodySerializer();
}

class _$WebHandoffBodySerializer implements PrimitiveSerializer<WebHandoffBody> {
  @override
  final Iterable<Type> types = const [WebHandoffBody, _$WebHandoffBody];

  @override
  final String wireName = r'WebHandoffBody';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    WebHandoffBody object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'next';
    yield serializers.serialize(
      object.next,
      specifiedType: const FullType(String),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    WebHandoffBody object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required WebHandoffBodyBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'next':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.next = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  WebHandoffBody deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = WebHandoffBodyBuilder();
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

