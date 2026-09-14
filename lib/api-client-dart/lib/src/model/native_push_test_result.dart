//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_collection/built_collection.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'native_push_test_result.g.dart';

/// Result of submitting a native push test to FCM. accepted confirms provider acceptance only; it is not proof that an OS notification was displayed on a device.
///
/// Properties:
/// * [targeted] - Number of registered mobile device tokens targeted
/// * [accepted] - Number of messages accepted by FCM
/// * [failures] - Failure category for each message not accepted by FCM
@BuiltValue()
abstract class NativePushTestResult implements Built<NativePushTestResult, NativePushTestResultBuilder> {
  /// Number of registered mobile device tokens targeted
  @BuiltValueField(wireName: r'targeted')
  int get targeted;

  /// Number of messages accepted by FCM
  @BuiltValueField(wireName: r'accepted')
  int get accepted;

  /// Failure category for each message not accepted by FCM
  @BuiltValueField(wireName: r'failures')
  BuiltList<NativePushTestResultFailuresEnum> get failures;
  // enum failuresEnum {  unregistered,  auth,  invalid,  network,  };

  NativePushTestResult._();

  factory NativePushTestResult([void updates(NativePushTestResultBuilder b)]) = _$NativePushTestResult;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(NativePushTestResultBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<NativePushTestResult> get serializer => _$NativePushTestResultSerializer();
}

class _$NativePushTestResultSerializer implements PrimitiveSerializer<NativePushTestResult> {
  @override
  final Iterable<Type> types = const [NativePushTestResult, _$NativePushTestResult];

  @override
  final String wireName = r'NativePushTestResult';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    NativePushTestResult object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'targeted';
    yield serializers.serialize(
      object.targeted,
      specifiedType: const FullType(int),
    );
    yield r'accepted';
    yield serializers.serialize(
      object.accepted,
      specifiedType: const FullType(int),
    );
    yield r'failures';
    yield serializers.serialize(
      object.failures,
      specifiedType: const FullType(BuiltList, [FullType(NativePushTestResultFailuresEnum)]),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    NativePushTestResult object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required NativePushTestResultBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'targeted':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(int),
          ) as int;
          result.targeted = valueDes;
          break;
        case r'accepted':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(int),
          ) as int;
          result.accepted = valueDes;
          break;
        case r'failures':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(BuiltList, [FullType(NativePushTestResultFailuresEnum)]),
          ) as BuiltList<NativePushTestResultFailuresEnum>;
          result.failures.replace(valueDes);
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  NativePushTestResult deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = NativePushTestResultBuilder();
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

class NativePushTestResultFailuresEnum extends EnumClass {

  @BuiltValueEnumConst(wireName: r'unregistered')
  static const NativePushTestResultFailuresEnum unregistered = _$nativePushTestResultFailuresEnum_unregistered;
  @BuiltValueEnumConst(wireName: r'auth')
  static const NativePushTestResultFailuresEnum auth = _$nativePushTestResultFailuresEnum_auth;
  @BuiltValueEnumConst(wireName: r'invalid')
  static const NativePushTestResultFailuresEnum invalid = _$nativePushTestResultFailuresEnum_invalid;
  @BuiltValueEnumConst(wireName: r'network')
  static const NativePushTestResultFailuresEnum network = _$nativePushTestResultFailuresEnum_network;

  static Serializer<NativePushTestResultFailuresEnum> get serializer => _$nativePushTestResultFailuresEnumSerializer;

  const NativePushTestResultFailuresEnum._(String name): super(name);

  static BuiltSet<NativePushTestResultFailuresEnum> get values => _$nativePushTestResultFailuresEnumValues;
  static NativePushTestResultFailuresEnum valueOf(String name) => _$nativePushTestResultFailuresEnumValueOf(name);
}

