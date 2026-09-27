//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'instrument_request_input.g.dart';

/// InstrumentRequestInput
///
/// Properties:
/// * [code] 
@BuiltValue()
abstract class InstrumentRequestInput implements Built<InstrumentRequestInput, InstrumentRequestInputBuilder> {
  @BuiltValueField(wireName: r'code')
  String get code;

  InstrumentRequestInput._();

  factory InstrumentRequestInput([void updates(InstrumentRequestInputBuilder b)]) = _$InstrumentRequestInput;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(InstrumentRequestInputBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<InstrumentRequestInput> get serializer => _$InstrumentRequestInputSerializer();
}

class _$InstrumentRequestInputSerializer implements PrimitiveSerializer<InstrumentRequestInput> {
  @override
  final Iterable<Type> types = const [InstrumentRequestInput, _$InstrumentRequestInput];

  @override
  final String wireName = r'InstrumentRequestInput';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    InstrumentRequestInput object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'code';
    yield serializers.serialize(
      object.code,
      specifiedType: const FullType(String),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    InstrumentRequestInput object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required InstrumentRequestInputBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'code':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.code = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  InstrumentRequestInput deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = InstrumentRequestInputBuilder();
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

