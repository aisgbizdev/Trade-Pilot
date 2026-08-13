//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:trade_pilot_api_client/src/model/upload_url_request.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'upload_url_response.g.dart';

/// UploadUrlResponse
///
/// Properties:
/// * [uploadURL] 
/// * [objectPath] 
/// * [metadata] 
@BuiltValue()
abstract class UploadUrlResponse implements Built<UploadUrlResponse, UploadUrlResponseBuilder> {
  @BuiltValueField(wireName: r'uploadURL')
  String get uploadURL;

  @BuiltValueField(wireName: r'objectPath')
  String get objectPath;

  @BuiltValueField(wireName: r'metadata')
  UploadUrlRequest? get metadata;

  UploadUrlResponse._();

  factory UploadUrlResponse([void updates(UploadUrlResponseBuilder b)]) = _$UploadUrlResponse;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(UploadUrlResponseBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<UploadUrlResponse> get serializer => _$UploadUrlResponseSerializer();
}

class _$UploadUrlResponseSerializer implements PrimitiveSerializer<UploadUrlResponse> {
  @override
  final Iterable<Type> types = const [UploadUrlResponse, _$UploadUrlResponse];

  @override
  final String wireName = r'UploadUrlResponse';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    UploadUrlResponse object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'uploadURL';
    yield serializers.serialize(
      object.uploadURL,
      specifiedType: const FullType(String),
    );
    yield r'objectPath';
    yield serializers.serialize(
      object.objectPath,
      specifiedType: const FullType(String),
    );
    if (object.metadata != null) {
      yield r'metadata';
      yield serializers.serialize(
        object.metadata,
        specifiedType: const FullType(UploadUrlRequest),
      );
    }
  }

  @override
  Object serialize(
    Serializers serializers,
    UploadUrlResponse object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required UploadUrlResponseBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'uploadURL':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.uploadURL = valueDes;
          break;
        case r'objectPath':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.objectPath = valueDes;
          break;
        case r'metadata':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(UploadUrlRequest),
          ) as UploadUrlRequest?;
          if (valueDes == null) continue;
          result.metadata.replace(valueDes);
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  UploadUrlResponse deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = UploadUrlResponseBuilder();
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

