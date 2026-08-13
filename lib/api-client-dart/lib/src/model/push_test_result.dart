//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'push_test_result.g.dart';

/// PushTestResult
///
/// Properties:
/// * [delivered] - Number of subscription endpoints the test push was dispatched to
@BuiltValue()
abstract class PushTestResult implements Built<PushTestResult, PushTestResultBuilder> {
  /// Number of subscription endpoints the test push was dispatched to
  @BuiltValueField(wireName: r'delivered')
  int get delivered;

  PushTestResult._();

  factory PushTestResult([void updates(PushTestResultBuilder b)]) = _$PushTestResult;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(PushTestResultBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<PushTestResult> get serializer => _$PushTestResultSerializer();
}

class _$PushTestResultSerializer implements PrimitiveSerializer<PushTestResult> {
  @override
  final Iterable<Type> types = const [PushTestResult, _$PushTestResult];

  @override
  final String wireName = r'PushTestResult';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    PushTestResult object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'delivered';
    yield serializers.serialize(
      object.delivered,
      specifiedType: const FullType(int),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    PushTestResult object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required PushTestResultBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'delivered':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(int),
          ) as int;
          result.delivered = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  PushTestResult deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = PushTestResultBuilder();
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

