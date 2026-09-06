//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'upload_url_request.g.dart';

/// UploadUrlRequest
///
/// Properties:
/// * [name] 
/// * [size] 
/// * [contentType] 
@BuiltValue()
abstract class UploadUrlRequest implements Built<UploadUrlRequest, UploadUrlRequestBuilder> {
  @BuiltValueField(wireName: r'name')
  String get name;

  @BuiltValueField(wireName: r'size')
  int get size;

  @BuiltValueField(wireName: r'contentType')
  String get contentType;

  UploadUrlRequest._();

  factory UploadUrlRequest([void updates(UploadUrlRequestBuilder b)]) = _$UploadUrlRequest;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(UploadUrlRequestBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<UploadUrlRequest> get serializer => _$UploadUrlRequestSerializer();
}

class _$UploadUrlRequestSerializer implements PrimitiveSerializer<UploadUrlRequest> {
  @override
  final Iterable<Type> types = const [UploadUrlRequest, _$UploadUrlRequest];

  @override
  final String wireName = r'UploadUrlRequest';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    UploadUrlRequest object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'name';
    yield serializers.serialize(
      object.name,
      specifiedType: const FullType(String),
    );
    yield r'size';
    yield serializers.serialize(
      object.size,
      specifiedType: const FullType(int),
    );
    yield r'contentType';
    yield serializers.serialize(
      object.contentType,
      specifiedType: const FullType(String),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    UploadUrlRequest object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required UploadUrlRequestBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'name':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.name = valueDes;
          break;
        case r'size':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(int),
          ) as int;
          result.size = valueDes;
          break;
        case r'contentType':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.contentType = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  UploadUrlRequest deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = UploadUrlRequestBuilder();
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

